import { useState, useEffect } from "react";
import axios from "axios";
import { getAppointmentsForDay } from "helpers/selectors";

export default function useApplicationData(initial) {
  const [state, setState] = useState(initial);
  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      const [first, second, third] = all;
      setState(prevState => ({ ...prevState, days: first.data, appointments: second.data, interviewers: third.data }))
    });
  }, [])

  const setDay = day => setState({ ...state, day });

  function countSpots(appointments) {
    const freeAppointments = Object.values(appointments).filter(appointment => appointment.interview === null);

    if(freeAppointments.length) {
      return freeAppointments.length;
    } else {
      return 0;
    }
  }

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    // Get the day
    let dayIndex = -1;
    for(let i = 0; i < state.days.length; i++) {
      if(state.day === state.days[i].name) {
        dayIndex = i;
        break;
      }
    }

    const days = [
      ...state.days,
    ]

    days[dayIndex] = { ...days[dayIndex], spots: countSpots(getAppointmentsForDay(state, state.day)) - 1};

    // Make the request with the correct endpoint using the appointment id, with the interview data in the body, we should receive a 204 No Content response.
    return new Promise((resolve, reject) => {
      axios.put(`/api/appointments/${id}`, { interview }).then(response => {
        // When the response comes back we update the state using the existing setState.
        if(response.status === 204) {
          setState(prevState => ({ ...prevState, appointments, days }));
          resolve();
        }
      }).catch(() => {
        reject();
      })
    });

    // Transition to SHOW when the promise returned by props.bookInterview resolves. This means that the PUT request is complete.
  }


  function deleteInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    // Get the day
    let dayIndex = -1;
    for(let i = 0; i < state.days.length; i++) {
      if(state.day === state.days[i].name) {
        dayIndex = i;
        break;
      }
    }

    const days = [
      ...state.days,
    ]

    days[dayIndex] = { ...days[dayIndex], spots: countSpots(getAppointmentsForDay(state, state.day)) + 1};

    // Make the request with the correct endpoint using the appointment id, with the interview data in the body, we should receive a 204 No Content response.
    return new Promise((resolve, reject) => {
      axios.delete(`/api/appointments/${id}`).then(response => {
        // When the response comes back we update the state using the existing setState.
        if(response.status === 204) {
          setState(prevState => ({ ...prevState, appointments, days }));
          resolve();
        }
      }).catch(() => {
        reject();
      })
    });

    // Transition to SHOW when the promise returned by props.bookInterview resolves. This means that the PUT request is complete.
  }

  return {
    state,
    setDay,
    bookInterview,
    deleteInterview
  }
}
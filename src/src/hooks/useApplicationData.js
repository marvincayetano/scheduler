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

  function updateSpots(value) {
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

    days[dayIndex] = { ...days[dayIndex], spots: countSpots(getAppointmentsForDay(state, state.day)) + value};

    return days;
  }

  function bookInterview(id, interview) {
    // Check if there is already an appointment in the spot
    // Then don't subtract 1 if there is already
    const appointment = {
      ...state.appointments[id],
    };

    const isExist = appointment.interview !== null;

    appointment.interview = { ...interview }

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const days = updateSpots(isExist? 0 : -1);

    // Make the request with the correct endpoint using the appointment id, with the interview data in the body, we should receive a 204 No Content response.
    return axios.put(`/api/appointments/${id}`, { interview }).then(response => {
        // When the response comes back we update the state using the existing setState.
        if(response.status === 204) {
          setState(prevState => ({ ...prevState, appointments, days }));
        }
    })
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
    const days = updateSpots(1);

    // Make the request with the correct endpoint using the appointment id, with the interview data in the body, we should receive a 204 No Content response.
    return axios.delete(`/api/appointments/${id}`).then(response => {
        // When the response comes back we update the state using the existing setState.
        if(response.status === 204) {
          setState(prevState => ({ ...prevState, appointments, days }));
        }
    });
  }

  return {
    state,
    setDay,
    bookInterview,
    deleteInterview
  }
}
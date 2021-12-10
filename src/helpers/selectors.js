export function getInterview(state, interview) {
  if(interview === null) return null;

  return { "interviewer": state.interviewers[`${interview.interviewer}`], "student": interview.student };
}

export function getInterviewersForDay(state, day) {
  const { days, appointments, interviewers} = state;

  const returnArray = [];

  for(const d of days) {
    if(d.name === day) {
      for(const appointment of d.appointments) {
        if(appointments[`${appointment}`] && appointments[`${appointment}`].interview && appointments[`${appointment}`].interview.interviewer) {
          const interviewerIndex = appointments[`${appointment}`].interview.interviewer;

          if(interviewerIndex) {
            returnArray.push(interviewers[interviewerIndex]);
          }
        }
      }

      return returnArray;
    }
  }

  return [];
}

export function getAppointmentsForDay(state, day) {
  const { days, appointments } = state;

  const returnArray = [];

  for(const d of days) {
    if(d.name === day) {
      for(const a of d.appointments) {
        returnArray.push(appointments[a]);
      }

      return returnArray;
    }
  }

  return [];
}
export function getInterview(state, interview) {
  if(interview === null) return null;

  return { "interviewer": state.interviewers[`${interview.interviewer}`], "student": interview.student };
}

export function getInterviewersForDay(state, day) {
  const { days, interviewers} = state;

  const returnArray = [];

  for(const d of days) {
    if(d.name === day) {
      if(d.interviewers) {
        for(const interviewerId of d.interviewers) {
          const interviewerObject = interviewers[`${interviewerId}`];

          if(interviewerObject) {
            returnArray.push(interviewerObject);
          }
        }

        return returnArray;
      }
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
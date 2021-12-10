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
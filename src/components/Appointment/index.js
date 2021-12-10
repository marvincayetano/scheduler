import React from "react";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import "./styles.scss";
import useVisualMode from "src/hooks/useVisualMode";
import Form from "./Form";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  return(
  <>
    {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
    {mode === SHOW && (
      <Show
        student={props.interview.student}
        interviewer={props.interview.interviewer}
      />
    )}
    {
      mode === CREATE && <Form interviewers={[]} onCancel={back} />
    }
  </>
  );
}
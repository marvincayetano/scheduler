import React, { useState } from "react";
import Show from "./Show";
import Empty from "./Empty";
import "./styles.scss";
import useVisualMode from "src/hooks/useVisualMode";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  const [form, setForm] = useState(null);

  function save(name, interviewer) {
    setForm({ name, interviewer });

    const interview = {
      student: name,
      interviewer
    };

    transition(SAVING);

    props.bookInterview(props.id, interview)
    .then(() => {
      transition(SHOW);
    }).catch(() => {
      transition(ERROR_SAVE, true);
    })
  }

  function onDelete() {
    transition(DELETING, true);

    props.deleteInterview(props.id)
    .then(() => {
      transition(EMPTY);
    }).catch(() => {
      transition(ERROR_DELETE, true);
    })
  }

  function getInterviewerName() {
    const interviewerArr = props.interviewers.filter(interviewer => interviewer.id === props.interview.interviewer);

    if(interviewerArr.length) {
      return interviewerArr[0].name;
    }
  }

  return(
  <>
    {mode === ERROR_DELETE && <Error onClose={() => transition(SHOW)} message={"Error deleting... Try again later..."}/>}
    {mode === ERROR_SAVE && <Error onClose={() => transition(CREATE, true)} message={"Error saving... Try again later..."}/>}
    {mode === EDIT && <Form interviewers={props.interviewers} student={props.interview.student} interviewer={props.interview.interviewer} onCancel={back} onSave={save} />}
    {mode === CONFIRM && <Confirm message={`Delete interview with ${props.interview.student}?`} onConfirm={() => onDelete()} onCancel={() => transition(SHOW)} />}
    {mode === DELETING && <Status message={"Deleting..."}/>}
    {mode === SAVING && <Status message={"Saving..."}/>}
    {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
    {mode === SHOW && (
      <Show
        student={props.interview && props.interview.student}
        interviewer={getInterviewerName() || ""}
        onDelete={() => transition(CONFIRM)}
        onEdit={() => transition(EDIT)}
      />
    )}
    {
      mode === CREATE && <Form
        student={form ? form.name : null}
        interviewer={form ? form.interviewer : null}
        interviewers={props.interviewers}
        onCancel={() => {
          back();
          setForm(null);
        }}
        onSave={save} />
    }
  </>
  );
}
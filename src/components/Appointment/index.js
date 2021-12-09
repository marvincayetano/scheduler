import React from "react";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";

import "./styles.scss";
export default function Appointment(props) {
  return(<>
    <Header time={props.time}/>
    {
      props.interview? <Show student={props.student} interviewer={props.interviewer}/> : <Empty/>
    }
  </>);
}
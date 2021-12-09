import React from "react";

import "components/Button.scss";
import classNames from "classnames";

export default function Button(props) {
  return <button className={classNames('button', { "button--confirm": props.confirm, "button--danger": props.danger } )} onClick={props.onClick} disabled={props.disabled}>{props.children}</button>;
}

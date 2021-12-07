import React from "react";

import "components/Button.scss";
import classNames from "classnames";
import { action } from "@storybook/addon-actions";

export default function Button(props) {
  let buttonClass = "button";

  if (props.confirm) {
    buttonClass += " button--confirm";
  }

  if (props.danger) {
    buttonClass += " button--danger";
  }

  return <button className={classNames('button', { "button--confirm": props.confirm, "button--danger": props.danger } )} onClick={props.onClick} disabled={props.disabled}>{props.children}</button>;
}

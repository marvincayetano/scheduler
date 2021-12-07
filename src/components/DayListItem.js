import classNames from "classnames";
import React from "react";
import "components/DayListItem.scss";

export default function DayListItem(props) {
  function formatSpots() {
    if(props.spots) {
      return `${props.spots} ${props.spots !== 1? "spots": "spot"} remaining`;
    }

    return `no spots remaining`;
  }

  return (
    <li onClick={() => props.setDay(props.name)} className={classNames("day-list__item", { "day-list__item--selected": props.selected, "day-list__item--full": props.spots === 0} )}>
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{ formatSpots() }</h3>
    </li>
  );
}
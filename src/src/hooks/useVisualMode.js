import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(newMode, replace = false) {
    setMode(newMode);

    if(replace) {
      const tempArr = [...history];
      tempArr.pop();
      setHistory([...tempArr, newMode]);
    } else {
      setHistory(prevHistory => [...prevHistory, newMode]);
    }
  }

  function back() {
    const tempArr = [...history];
    tempArr.pop();

    setHistory(tempArr);
    if(tempArr.length > 0) {
      console.log(tempArr[tempArr.length - 1]);
      setMode(tempArr[tempArr.length - 1])
    }
  }

  return { mode, transition, back };
}
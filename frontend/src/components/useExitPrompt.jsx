import { useState, useEffect } from "react";

const useExitPrompt = (initialState) => {
  const [showExitPrompt, setShowExitPrompt] = useState(initialState);

  const initBeforeUnLoad = (show) => {
    window.onbeforeunload = (event) => {
      if (show) {
        const e = event || window.event;
        e.preventDefault();
        if (e) {
          e.returnValue = "";
        }
        return "";
      }
    };
  };

  useEffect(() => {
    initBeforeUnLoad(showExitPrompt);
  }, [showExitPrompt]);

  return [showExitPrompt, setShowExitPrompt];
};

export default useExitPrompt;

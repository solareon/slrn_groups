import React, { useEffect, useRef, useState } from "react";
import GroupDashboard from "./GroupDashboard";
import PlayerList from "./PlayerList";
import GroupJob from "./GroupJob";
import { GroupJobStep } from "../types/GroupJobStep";
import { Group } from "../types/Group";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { useGroupStore } from "../storage/GroupStore";
import "./App.css";
import { debugData } from "../utils/debugData";

// This will set the NUI to visible if we are
// developing in browser
debugData([
  {
    action: "setVisible",
    data: true,
  },
]);

const App: React.FC = () => {
  const [theme, setTheme] = useState("light");
  const appDiv = useRef(null);

  const [currentPage, setCurrentPage] = useState("GroupDashboard");
  const { inGroup, currentGroup } = useGroupStore();

  useEffect(() => {
    if (!inGroup) {
      setCurrentPage("GroupDashboard");
    }
  }, [inGroup]);

  useNuiEvent("startJob", () => {
    setCurrentPage("GroupJob");
  });

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      <div
        className="size-full text-center text-text gap-4 bg-background"
        ref={appDiv}
        data-theme={theme}
      >
        <button onClick={toggleTheme} className="w-full rounded-m">
          Toggle Theme
        </button>
        <div>&nbsp;</div>
        <div className="text-left text-4xl font-bold mt-6 mb-2 pt-2">
          Groups
        </div>
        {currentPage === "GroupDashboard" && (
          <GroupDashboard setCurrentPage={setCurrentPage} />
        )}
        {currentPage === "GroupJob" && (
          <GroupJob setCurrentPage={setCurrentPage} />
        )}
      </div>
    </>
  );
};

export default App;

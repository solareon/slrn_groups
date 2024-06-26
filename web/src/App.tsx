import React, { useEffect, useRef, useState } from "react";
import GroupDashboard from "./components/GroupDashboard";
import PlayerList from "./components/PlayerList";
import GroupJob from "./components/GroupJob";
import DataHandler from "./components/DataHandler";
import { GroupJobStep } from "./types/GroupJobStep";
import { Group } from "./types/Group";
import { useNuiEvent } from "./hooks/useNuiEvent";
import { fetchReactNui } from "./utils/fetchReactNui";
import { useGroupJobStepStore } from "./storage/GroupJobStepStore";
import { useGroupStore } from "./storage/GroupStore";
import { usePlayerDataStore } from "./storage/PlayerDataStore";
import "./App.css";

const devMode = !window?.["invokeNative"];

const App = () => {
  const [theme, setTheme] = useState("light");
  const appDiv = useRef(null);

  const {
    setPopUp,
    fetchNui,
    sendNotification,
    getSettings,
    onSettingsChange,
  } = window as any;
  const [currentPage, setCurrentPage] = useState("GroupDashboard");
  const { setGroupJobSteps } = useGroupJobStepStore();
  const { inGroup, setGroups } = useGroupStore();
  const { setPlayerData } = usePlayerDataStore();

  useEffect(() => {
    if (devMode) {
      document.getElementsByTagName("html")[0].style.visibility = "visible";
      document.getElementsByTagName("body")[0].style.visibility = "visible";
      return;
    } else {
      getSettings().then((settings: any) => setTheme(settings.display.theme));
      onSettingsChange((settings: any) => setTheme(settings.display.theme));
    }
  }, [theme]);

  useEffect(() => {
    fetchReactNui("getPlayerData", {}, {
      source: 1,
      citizenId: 'ABCD1234',
    }).then((data) => {
      setPlayerData(data);
    });

    fetchReactNui<Group[]>("getGroupData", {}, [
      {
        id: 1,
        name: "Group 1",
        memberCount: 1,
      },
      {
        id: 2,
        name: "Group 2",
        memberCount: 2,
      },
      {
        id: 3,
        name: "Group 3",
        memberCount: 3,
      },
      {
        id: 4,
        name: "Group 4",
        memberCount: 4,
      }
    ]).then((data) => setGroups(data));
  }, []);

  useEffect(() => {
    if (!inGroup) {
      setCurrentPage("GroupDashboard");
    }
  }, [inGroup]);

  useNuiEvent("startJob", () => {
    setCurrentPage("GroupJob");
  });

  useNuiEvent("sendNotification", (data: any) => {
    sendNotification(data);
  });

  useNuiEvent("phoneNotification", (data: any) => {
    setPopUp({
      title: data.PhoneNotify.title,
      description: data.PhoneNotify.text,
      buttons: [
        {
          title: data.PhoneNotify.deny,
          color: "red",
          cb: () => {
            $.post(
              "https://slrn_groups/AnsweredNotify",
              JSON.stringify({
                type: "failure",
              })
            );
          },
        },
        {
          title: data.PhoneNotify.accept,
          color: "blue",
          cb: () => {
            $.post(
              "https://slrn_groups/AnsweredNotify",
              JSON.stringify({
                type: "success",
              })
            );
          },
        },
      ],
    });
  });

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <AppProvider>
      <div
        className="size-full text-center text-text gap-4 bg-background"
        ref={appDiv}
        data-theme={theme}
      >
        {!devMode && (
          <button onClick={toggleTheme} className="w-full rounded-m">
            Toggle Theme
          </button>
        )}
        <div className="text-left text-4xl font-bold m-2 pt-2">Groups</div>
        {currentPage === "GroupDashboard" && (
          <GroupDashboard
            setCurrentPage={setCurrentPage}
          />
        )}
        {currentPage === "GroupJob" && (
          <GroupJob setCurrentPage={setCurrentPage} />
        )}
      </div>
      <DataHandler />
    </AppProvider>
  );
};

const AppProvider: React.FC = ({ children }) => {
  if (devMode) {
    return (
      <div className="absolute bottom-0 top-0 left-0 right-0 m-auto w-[29rem] h-[58.5rem]">
        {children}
      </div>
    );
  } else return children;
};

export default App;

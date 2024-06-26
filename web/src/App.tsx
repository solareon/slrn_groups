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
    fetchReactNui("setPlayerData", {}, {
      source: 1,
      citizenId: 'ABCD1234',
      name: 'Testicle',
    }).then((data) => {
      setPlayerData(data);
    });

    fetchReactNui<GroupJobStep[]>("getGroupJobSteps", {}, [
      { id: 1, name: "Step 1", isDone: false },
      { id: 2, name: "Step 2", isDone: false },
      { id: 3, name: "Step 3", isDone: false },
    ]).then((data) => {
      setGroupJobSteps(data);
    });

    fetchReactNui<Group[]>("refreshGroups", {}, [
      {
        id: 1,
        status: "open",
        GName: "Larrys Group",
        GPass: "password",
        leader: 1,
        members: [
          { name: "Larry", CID: "ABCD1234", Player: 1 },
          { name: "Barry", CID: "EFGH5678", Player: 2 },
          { name: "Harry", CID: "IJKL9101", Player: 3 },
        ],
        stage: [],
        ScriptCreated: false,
      },
      {
        id: 2,
        status: "open",
        GName: "Group 2",
        GPass: "password",
        leader: 2,
        members: [{ name: "Larry", CID: "ABCD1234", Player: 3 }],
        stage: [],
        ScriptCreated: false,
      },
      {
        id: 3,
        status: "open",
        GName: "Group 3",
        GPass: "password",
        leader: 3,
        members: [
          { name: "Larry", CID: "ABCD1234", Player: 2 },
          { name: "Barry", CID: "EFGH5678", Player: 3 },
        ],
        stage: [],
        ScriptCreated: false,
      },
      {
        id: 4,
        status: "open",
        GName: "Group 4",
        GPass: "password",
        leader: 4,
        members: [{ name: "Larry", CID: "ABCD1234", Player: 4 }],
        stage: [],
        ScriptCreated: false,
      },
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

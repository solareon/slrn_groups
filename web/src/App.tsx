import React, { useEffect, useRef, useState } from "react";
import GroupDashboard from "./components/GroupDashboard";
import PlayerList from "./components/PlayerList";
import GroupJob from "./components/GroupJob";
import DataHandler from "./components/DataHandler";
import { GroupJobStep } from "./types/GroupJobStep";
import { Group } from "./types/Group";
import { useNuiEvent } from "./hooks/useNuiEvent";
import { useGroupStore } from "./storage/GroupStore";
import { usePlayerDataStore } from "./storage/PlayerDataStore";
import { fetchNui as fetchNuiRequest } from "./utils/fetchNui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun, faXmark } from "@fortawesome/free-solid-svg-icons";
import "./App.css";

const devMode = !window?.["invokeNative"];
const devStandalone = devMode && new URLSearchParams(window.location.search).get("standalone") === "1";

const App = () => {
  const [theme, setTheme] = useState("light");
  const [standalone, setStandalone] = useState(devStandalone);
  const [visible, setVisible] = useState(true);
  const [notification, setNotification] = useState<{ title?: string; message: string } | null>(null);
  const appDiv = useRef(null);

  const {
    setPopUp,
    fetchNui,
    sendNotification,
    getSettings,
    onSettingsChange,
  } = window as any;
  const nuiFetch = fetchNui || fetchNuiRequest;
  const [currentPage, setCurrentPage] = useState("GroupDashboard");
  const { inGroup, currentGroup } = useGroupStore();
  const { playerData } = usePlayerDataStore();

  useEffect(() => {
    if (devMode || standalone) {
      document.getElementsByTagName("html")[0].style.visibility = "visible";
      document.getElementsByTagName("body")[0].style.visibility = "visible";
      return;
    } else {
      getSettings().then((settings: any) => setTheme(settings.display.theme));
      onSettingsChange((settings: any) => setTheme(settings.display.theme));
    }
  }, [theme, standalone]);

  useEffect(() => {
    if (!inGroup) {
      setCurrentPage("GroupDashboard");
    }
  }, [inGroup]);

  useNuiEvent("startJob", () => {
    setCurrentPage("GroupJob");
  });

  useNuiEvent<{ visible: boolean; theme?: string }>("standalone:setVisible", (data) => {
    setStandalone(true);
    setVisible(data.visible);
    if (data.theme === "light" || data.theme === "dark") setTheme(data.theme);
  });

  useNuiEvent<{ title?: string; message: string }>("sendNotification", (data) => {
    setNotification(data);
    window.setTimeout(() => setNotification(null), 3500);
  });

  useNuiEvent("sendNotification", (data: any) => {
    if (!standalone) sendNotification(data);
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
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    if (standalone && !devMode) void nuiFetch("setStandaloneTheme", nextTheme);
  };

  const closeStandalone = () => {
    if (!devMode) void nuiFetch("closeStandalone");
    setVisible(false);
  };

  useEffect(() => {
    if (!standalone) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeStandalone();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [standalone]);

  if (standalone && !visible) return null;

  return (
    <AppProvider>
      <div
        className={`${standalone ? "standalone-frame fixed bottom-[2vh] right-[2vh] h-[min(58.5rem,94vh)] w-[min(29rem,92vw)] overflow-hidden rounded-[2.75rem] border-[0.55rem] border-neutral-950 shadow-2xl" : "size-full h-screen"} text-center text-text gap-4 bg-background p-4 px-6`}
        ref={appDiv}
        data-theme={theme}
      >
        {standalone && (
          <div className="absolute right-5 top-4 z-40 flex gap-2">
            <button aria-label="Toggle theme" className="flex h-9 w-9 items-center justify-center rounded-full bg-primary shadow-md" onClick={toggleTheme}>
              <FontAwesomeIcon icon={theme === "dark" ? faSun : faMoon} />
            </button>
            <button aria-label="Close Groups" className="flex h-9 w-9 items-center justify-center rounded-full bg-primary shadow-md hover:bg-danger hover:text-white" onClick={closeStandalone}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        )}
        {devMode && !standalone && (
          <button onClick={toggleTheme} className="w-full rounded-m">
            Toggle Theme
          </button>
        )}
        <div>&nbsp;</div>
        <div className="text-left text-4xl font-extralight mt-6 mb-2 pt-2">Groups</div>
        {currentPage === "GroupDashboard" && (
          <GroupDashboard
            setCurrentPage={setCurrentPage} fetchNui={nuiFetch}
          />
        )}
        {currentPage === "GroupJob" && (
          <GroupJob setCurrentPage={setCurrentPage} fetchNui={nuiFetch}/>
        )}
        {notification && (
          <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-primary px-4 py-3 shadow-lg">
            <div className="font-semibold">{notification.title}</div>
            <div>{notification.message}</div>
          </div>
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

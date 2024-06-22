import React, { useEffect, useRef, useState } from "react";
import GroupDashboard from "./components/GroupDashboard";
import JoinGroup from "./components/JoinGroup";
import PlayerList from "./components/PlayerList";
import GroupJob from "./components/GroupJob";
import { GroupJobStep } from "./types/GroupJobStep";
import { Group } from "./types/Group";
import { useNuiEvent } from "./hooks/useNuiEvent";
import "./App.css";

const devMode = !window?.["invokeNative"];

const App = () => {
    const [theme, setTheme] = useState("light");
    const [notificationText, setNotificationText] =
        useState("Notification text");
    const appDiv = useRef(null);

    const {
        setPopUp,
        setContextMenu,
        selectGIF,
        selectGallery,
        selectEmoji,
        fetchNui,
        sendNotification,
        getSettings,
        onSettingsChange,
        colorPicker,
        useCamera,
    } = window as any;

    const initialSteps: GroupJobStep[] = [
        { id: 1, name: "Step 1", isDone: false },
        { id: 2, name: "Step 2", isDone: false },
        { id: 3, name: "Step 3", isDone: false },
    ];

    const [groups, setGroups] = useState<Group>([
        {
            id: 1,
            status: "open",
            GName: "Group 1",
            GPass: "password",
            Users: 1,
            leader: 1,
            members: [{ name: "Larry", CID: "ABCD1234", Player: 1 }],
            stage: initialSteps,
            ScriptCreated: false,
        },
    ]);

    const createGroup = () => {
        const newGroup = {
            id: groups.length + 1,
            status: "open",
            name: `Group ${groups.length + 1}`,
            GPass: "password",
            Users: 1,
            leader: 1,
            members: [{ name: "Larry", CID: "ABCD1234", Player: 1 }],
            stage: initialSteps,
            ScriptCreated: false,
        };
        setGroups([...groups, newGroup]);
    };

    useEffect(() => {
        if (devMode) {
            document.getElementsByTagName("html")[0].style.visibility =
                "visible";
            document.getElementsByTagName("body")[0].style.visibility =
                "visible";
            return;
        } else {
            getSettings().then((settings: any) =>
                setTheme(settings.display.theme)
            );
            onSettingsChange((settings: any) =>
                setTheme(settings.display.theme)
            );
        }

        fetchNui("getDirection").then((direction: string) =>
            setDirection(direction)
        );

        window.addEventListener("message", function (event) {
            switch (event.data.action) {
                case "LoadPhoneData":
                    QB.Phone.Functions.LoadPhoneData(event.data);
                    break;
                case "LoadJobCenterApp":
                    LoadJobCenterApp();
                    break;
                case "testPassword":
                    $("#jobcenter-box-new-join").fadeIn(350);
                    break;
                case "PhoneNotification":
                    setPopUp({
                        title: event.data.PhoneNotify.title,
                        description: event.data.PhoneNotify.text,
                        buttons: [
                            {
                                title: event.data.PhoneNotify.deny,
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
                                title: event.data.PhoneNotify.accept,
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
                    break;
                case "SendNotify":
                    sendNotification({ title: event.data.msg });
                    break;
            }
        });
    }, [theme]);

    useEffect(() => {
        if (notificationText === "") setNotificationText("Notification text");
    }, [notificationText]);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
        console.log(theme);
    };

    return (
      <AppProvider>
      <div
        className={`h-screen w-full flex items-center justify-center flex-wrap bg-background-primary-light dark:bg-background-primary-dark font-poppins ${devMode ? "" : "hidden"}`}
        ref={appDiv}
        data-mode={theme}
      >
        <div className="w-full h-full flex flex-col items-center justify-center gap-12">
        <div className="flex flex-col text-center gap-4">
          <button
          onClick={toggleTheme}
          className="w-56 h-13 bg-background-highlight-light dark:bg-background-highlight-dark text-text-primary-light dark:text-text-primary-dark rounded-m"
          >
          Toggle Theme
          </button>
          <GroupDashboard
          groups={groups}
          createGroup={createGroup}
          />
          <JoinGroup />
          <PlayerList />
          <GroupJob initialSteps={initialSteps} />
        </div>
        </div>
      </div>
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

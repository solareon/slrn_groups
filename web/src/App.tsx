import React, { useEffect, useRef, useState } from "react";
import GroupDashboard from "./components/GroupDashboard";
import JoinGroup from "./components/JoinGroup";
import PlayerList from "./components/PlayerList";
import GroupJob from "./components/GroupJob";
import { useGroupStore } from "./storage/GroupStore";
import { useGroupJobStepStore } from "./storage/GroupJobStepStore";
import { GroupJobStep } from "./types/GroupJobStep";
import { Group } from "./types/Group";
import { useNuiEvent } from "./hooks/useNuiEvent";
import "./App.css";

const devMode = !window?.["invokeNative"];

const App = () => {
    const [theme, setTheme] = useState("light");
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

    const { groups, setGroups } = useGroupStore();
    const { groupJobSteps } = useGroupJobStepStore();

    const createGroup = () => {
        const newGroup = {
            id: groups.length + 1,
            status: "open",
            name: `Group ${groups.length + 1}`,
            GPass: "password",
            Users: 1,
            leader: 1,
            members: [{ name: "Larry", CID: "ABCD1234", Player: 1 }],
            stage: groupJobSteps,
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

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
        console.log(theme);
    };

    return (
        <AppProvider>
            <div
                className="grid grid-cols-1 size-full items-center justify-center bg-background-primary-light dark:bg-background-primary-dark font-poppins text-center gap-4"
                ref={appDiv}
                data-mode={theme}
            >
                <button
                    onClick={toggleTheme}
                    className="w-56 h-13 bg-background-highlight-light dark:bg-background-highlight-dark text-text-primary-light dark:text-text-primary-dark rounded-m"
                >
                    Toggle Theme
                </button>
                <GroupDashboard groups={groups} createGroup={createGroup} />
                <JoinGroup />
                <PlayerList />
                <GroupJob />
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

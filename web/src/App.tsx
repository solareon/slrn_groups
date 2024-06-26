import React, { useEffect, useRef, useState } from 'react';
import GroupDashboard from './components/GroupDashboard';
import PlayerList from './components/PlayerList';
import GroupJob from './components/GroupJob';
import { GroupJobStep } from './types/GroupJobStep';
import { Group } from './types/Group';
import { useNuiEvent } from './hooks/useNuiEvent';
import './App.css';

const devMode = !window?.['invokeNative'];

const App = () => {
  const [theme, setTheme] = useState('light');
  const appDiv = useRef(null);

  const {
    setPopUp,
    fetchNui,
    sendNotification,
    getSettings,
    onSettingsChange,
  } = window as any;
  const [currentPage, setCurrentPage] = useState('GroupDashboard');

  useEffect(() => {
    if (devMode) {
      document.getElementsByTagName('html')[0].style.visibility = 'visible';
      document.getElementsByTagName('body')[0].style.visibility = 'visible';
      return;
    } else {
      getSettings().then((settings: any) => setTheme(settings.display.theme));
      onSettingsChange((settings: any) => setTheme(settings.display.theme));
    }

  }, [theme]);

  useNuiEvent('startJob', () => {
    setCurrentPage('GroupJob');
  });

  useNuiEvent('sendNotification', (data: any) => {
    sendNotification(data);
  });

  useNuiEvent('phoneNotification', (data: any) => {
    setPopUp({
      title: data.PhoneNotify.title,
      description: data.PhoneNotify.text,
      buttons: [
        {
          title: data.PhoneNotify.deny,
          color: 'red',
          cb: () => {
            $.post(
              'https://slrn_groups/AnsweredNotify',
              JSON.stringify({
                type: 'failure',
              })
            );
          },
        },
        {
          title: data.PhoneNotify.accept,
          color: 'blue',
          cb: () => {
            $.post(
              'https://slrn_groups/AnsweredNotify',
              JSON.stringify({
                type: 'success',
              })
            );
          },
        },
      ],
    });
  });

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    console.log(theme);
  };

  return (
    <AppProvider>
      <button
        onClick={toggleTheme}
        className='w-full bg-background-highlight-light dark:bg-background-highlight-dark text-text-primary-light dark:text-text-primary-dark rounded-m'
      >
        Toggle Theme
      </button>
      <div
        className='size-full bg-background-primary-light dark:bg-background-primary-dark text-center gap-4'
        ref={appDiv}
        data-mode={theme}
      >
        <div className='text-left text-4xl font-bold text-text-primary-light dark:text-text-primary-dark m-2 pt-2'>
          Groups
        </div>
        {currentPage === 'GroupDashboard' && (
          <GroupDashboard
            setCurrentPage={setCurrentPage}
          />
        )}
        {currentPage === 'GroupJob' && (
          <GroupJob setCurrentPage={setCurrentPage} />
        )}
      </div>
    </AppProvider>
  );
};

const AppProvider: React.FC = ({ children }) => {
  if (devMode) {
    return (
      <div className='absolute bottom-0 top-0 left-0 right-0 m-auto w-[29rem] h-[58.5rem]'>
        {children}
      </div>
    );
  } else return children;
};

export default App;

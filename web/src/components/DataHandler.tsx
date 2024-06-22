import React from 'react';
import { useNuiEvent } from '../hooks/useNuiEvent';
import { usePlayerDataStore } from '../storage/PlayerDataStore';

const DataHandler: React.FC = () => {
  const { setPlayerData } = usePlayerDataStore();

  useNuiEvent('LoadPhoneData', setPlayerData);

  return null; // This component doesn't render anything
};

export default DataHandler;

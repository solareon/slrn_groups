import React from 'react';
import { useNuiEvent } from '../hooks/useNuiEvent';
import { usePlayerDataStore } from '../storage/PlayerDataStore';
import { useGroupStore } from '../storage/GroupStore';

const DataHandler: React.FC = () => {
    const { setPlayerData } = usePlayerDataStore();
    const { setGroups } = useGroupStore();

    useNuiEvent('setPlayerData', setPlayerData);
    useNuiEvent('setGroups', setGroups);

    return null; // This component doesn't render anything
};

export default DataHandler;

if GetResourceState('qbx_core') ~= 'started' then return end

function GetPlayerData()
    return QBX.PlayerData.citizenid
end
if GetResourceState('qb-core') ~= 'started' or GetResourceState('qbx_core') == 'started' then return end

local QBCore = exports['qb-core']:GetCoreObject()

function GetPlayerData(source)
    local player = QBCore.Functions.GetPlayer(source)
    return player.PlayerData
end

---Get the player data from the source
---@param source number
---@return string
function GetPlayerName(source)
    local playerData = GetPlayerData(source)
    return playerData.charinfo.firstname .. ' ' .. playerData.charinfo.lastname
end
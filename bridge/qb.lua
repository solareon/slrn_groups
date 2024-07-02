if GetResourceState('qb-core') ~= 'started' or GetResourceState('qbx_core') == 'started' then return end

local QBCore = exports['qb-core']:GetCoreObject()

if not IsDuplicityVersion() then
    function SendNotification(message, title)
        QBCore.Functions.Notify(title and {text = title, caption = message} or message, 'primary', 5000)
    end
    return
end

function SendNotification(source, message, title)
    TriggerClientEvent('QBCore:Notify', source, title and {text = title, caption = message} or message, 'primary', 5000)
end

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
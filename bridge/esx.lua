if GetResourceState('es_extended') ~= 'started' then return end

local ESX = exports.es_extended:getSharedObject()

if not IsDuplicityVersion() then
    function SendNotification(message, _)
        ESX.ShowNotification(message, 'info')
    end
    return
end

function SendNotification(source, message, _)
    TriggerClientEvent('esx:showNotification', source, message, 'info', 5000)
end

local function getPlayer(source)
    return ESX.GetPlayerFromId(source)
end

---Get the player data from the source
---@param source number
---@return string
function GetPlayerName(source)
    local xPlayer = getPlayer(source)
    return xPlayer.getName()
end
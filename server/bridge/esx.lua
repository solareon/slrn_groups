if GetResourceState('es_extended') ~= 'started' then return end

local ESX = exports.es_extended:getSharedObject()

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
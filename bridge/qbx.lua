if GetResourceState('qbx_core') ~= 'started' then return end

if not IsDuplicityVersion() then return end

function GetPlayerData(source)
    return exports.qbx_core:GetPlayer(source).PlayerData
end

---Get the player data from the source
---@param source number
---@return string
function GetPlayerName(source)
    local playerData = GetPlayerData(source)
    return playerData.charinfo.firstname .. ' ' .. playerData.charinfo.lastname
end

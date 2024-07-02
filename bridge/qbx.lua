if GetResourceState('qbx_core') ~= 'started' then return end

if not IsDuplicityVersion() then
    function SendNotification(message, title)
        exports.qbx_core:Notify(title or message, 'inform', 5000, title and message or nil)
    end
    return
end

function SendNotification(source, message, title)
    exports.qbx_core:Notify(source, title or message, 'inform', 5000, title and message or nil)
end

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

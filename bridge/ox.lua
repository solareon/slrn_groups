if GetResourceState('ox_core') ~= 'started' then return end

local Ox = require '@ox_core.lib.init'

if not IsDuplicityVersion() then
    function SendNotification(message, title)
        lib.notify({
            title = title and title or message,
            description = title and message or nil,
            type = 'inform',
            duration = 5000
        })
    end
    return
end

function SendNotification(source, message, title)
    local notifyData = {
        title = title and title or message,
        description = title and message or nil,
        type = 'inform',
        duration = 5000
    }
    TriggerClientEvent('ox_lib:notify', source, notifyData)
end

---Get the player data from the source
---@param source number
---@return string
function GetPlayerName(source)
    local player = Ox.GetPlayer(source)

    return player and player.charId and player.get('name')
end
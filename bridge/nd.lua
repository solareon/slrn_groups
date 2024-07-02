if not lib.checkDependency('ND_Core', '2.0.0') then return end

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

NDCore = {}

lib.load('@ND_Core.init')

function GetPlayer(id)
    return NDCore.getPlayer(id)
end

---Get the player data from the source
---@param source number
---@return string
function GetPlayerName(source)
    local player = GetPlayer(source)
    return player.fullname
end

if not lib.checkDependency('ND_Core', '2.0.0') then return end

if not IsDuplicityVersion() then return end

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

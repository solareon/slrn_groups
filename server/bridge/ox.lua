if not lib.checkDependency('ox_core', '0.21.3', true) then return end

local Ox = require '@ox_core.lib.init'

---Get the player data from the source
---@param source number
---@return string
function GetPlayerName(source)
    local player = Ox.GetPlayer(source)

    return player and player.charId and player.get('name')
end
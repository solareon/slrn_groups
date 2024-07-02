if GetResourceState('ox_core') ~= 'started' then return end

if not IsDuplicityVersion() then return end

local Ox = require '@ox_core.lib.init'

---Get the player data from the source
---@param source number
---@return string
function GetPlayerName(source)
    local player = Ox.GetPlayer(source)

    return player and player.charId and player.get('name')
end
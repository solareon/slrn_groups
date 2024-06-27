
---@type table <number, BlipData>
local GroupBlips = {}

---Removes a blip by name
---@param name string
local function removeBlipByName(name)
    for i = 1, #GroupBlips do
        local blip = GroupBlips[i]

        if blip?.name == name then
            SetBlipRoute(blip.blip, false)
            RemoveBlip(blip.blip)
            table.remove(GroupBlips, i)
            break
        end
    end
end


RegisterNetEvent('groups:removeBlip', removeBlipByName)

---Creates a blip from the data passed
---@param name string
---@param data BlipData
RegisterNetEvent('groups:createBlip', function(name, data)
    if not data then return
        print('Invalid Data was passed to the create blip event')
    end

    -- We remove the blip if it already exists with the same name
    removeBlipByName(name)

    local blip
    if data.entity then
        blip = AddBlipForEntity(data.entity)
    elseif data.netId then
        blip = AddBlipForEntity(NetworkGetEntityFromNetworkId(data.netId))
    elseif data.radius then
        blip = AddBlipForRadius(data.coords.x, data.coords.y, data.coords.z, data.radius)
    else
        blip = AddBlipForCoord(data.coords.x, data.coords.y, data.coords.z)
    end

    if not data.radius then
        SetBlipSprite(blip, data.sprite or 1)
        SetBlipScale(blip, data.scale or 0.7)
        BeginTextCommandSetBlipName('STRING')
        AddTextComponentSubstringPlayerName(data.label or 'NO LABEL FOUND')
        EndTextCommandSetBlipName(blip)
    end

    SetBlipColour(blip, data.color or 1)
    SetBlipAlpha(blip, data.alpha or 255)

    if data.route then
        SetBlipRoute(blip, true)
        SetBlipRouteColour(blip, data.routeColor or 1)
    end

    GroupBlips[#GroupBlips + 1] = { name = name, blip = blip }
end)
---@diagnostic disable: lowercase-global

local identifier = 'slrn_groups'

-- Bridge
if GetResourceState('qbx_core') == 'started' then
    function getPlayerData()
        return QBX.PlayerData.citizenid
    end
else
    local QBCore = exports['qb-core']:GetCoreObject()

    function getPlayerData()
        return QBCore.Functions.GetPlayerData()
    end
end

CreateThread(function()
    while GetResourceState('lb-phone') ~= 'started' do
        Wait(500)
    end

    local function AddApp()
        local added, errorMessage = exports['lb-phone']:AddCustomApp({
            identifier = identifier,
            name = 'Groups',
            description = 'Group app to do stuff together',
            developer = 'solareon',
            defaultApp = true,
            ui = 'slrn_groups/web/dist/assets/index.html',
            icon = 'https://cfx-nui-slrn_groups/web/dist/icon.png'
        })
        if not added then
            print('Could not add app:', errorMessage)
        end
    end

    AddApp()

    AddEventHandler('onResourceStart', function(resource)
        if resource == 'lb-phone' or resource == GetCurrentResourceName() then
            AddApp()
        end
    end)
end)

local GroupBlips = {}

local function FindBlipByName(name)
    for i = 1, #GroupBlips do
        if GroupBlips[i] and GroupBlips[i].name == name then
            return i
        end
    end
end

RegisterNetEvent('groups:removeBlip', function(name)
    local i = FindBlipByName(name)
    if i then
        local blip = GroupBlips[i]['blip']
        SetBlipRoute(blip, false)
        RemoveBlip(blip)
        GroupBlips[i] = nil
    end
end)

RegisterNetEvent('groups:createBlip', function(name, data)
    if not data then return print('Invalid Data was passed to the create blip event') end

    if FindBlipByName(name) then
        TriggerEvent('groups:removeBlip', name)
    end

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

    if not data.color then data.color = 1 end
    if not data.alpha then data.alpha = 255 end

    if not data.radius then
        if not data.sprite then data.sprite = 1 end
        if not data.scale then data.scale = 0.7 end
        if not data.label then data.label = 'NO LABEL FOUND' end

        SetBlipSprite(blip, data.sprite)
        SetBlipScale(blip, data.scale)
        BeginTextCommandSetBlipName('STRING')
        AddTextComponentSubstringPlayerName(data.label)
        EndTextCommandSetBlipName(blip)
    end

    SetBlipColour(blip, data.color)
    SetBlipAlpha(blip, data.alpha)

    if data.route then
        SetBlipRoute(blip, true)
        SetBlipRouteColour(blip, data.routeColor)
    end
    GroupBlips[#GroupBlips + 1] = { name = name, blip = blip }
end)

RegisterNuiCallback('getPlayerData', function(_, cb)
    local citizenId = getPlayerData()
    local playerData = {
        source = cache.serverId,
        citizenId = citizenId
    }
    cb(playerData)
end)

RegisterNuiCallback('getGroupData', function(_, cb)
    cb({})
    local groups, inGroup, groupStatus, groupStages = lib.callback.await('slrn_groups:server:getAllGroups')
    if groups then
        exports['lb-phone']:SendCustomAppMessage(identifier, {
            action = 'setGroups',
            data = groups,
        })
    end
    exports['lb-phone']:SendCustomAppMessage(identifier, {
        action = 'setInGroup',
        data = inGroup and true or false
    })
    exports['lb-phone']:SendCustomAppMessage(identifier, {
        action = 'setCurrentGroup',
        data = inGroup or nil
    })
    exports['lb-phone']:SendCustomAppMessage(identifier, {
        action = 'setGroupJobSteps',
        data = groupStages or {}
    })
    if groupStatus == 'IN_PROGRESS' then
        exports['lb-phone']:SendCustomAppMessage(identifier, {
            action = 'startJob',
            data = {}
        })
    end
end)

RegisterNuiCallback('createGroup', function(data, cb)
    TriggerServerEvent('slrn_groups:server:createGroup', data)
    cb({})
end)

RegisterNuiCallback('joinGroup', function(data, cb)
    local message = lib.callback.await('slrn_groups:server:joinGroup', data)

    exports['lb-phone']:SendNotification({
        app = identifier,
        content = message,
    })
    cb({})
end)

RegisterNuiCallback('leaveGroup', function(_, cb)
    local message = lib.callback.await('slrn_groups:server:leaveGroup')

    exports['lb-phone']:SendNotification({
        app = identifier,
        content = message,
    })
    cb({})
end)

RegisterNuiCallback('deleteGroup', function(_, cb)
    local message = lib.callback.await('slrn_groups:server:deleteGroup')

    exports['lb-phone']:SendNotification({
        app = identifier,
        content = message,
    })
    cb({})
end)

RegisterNUICallback('getMemberList', function(_, cb)
    local groupNames = lib.callback.await('slrn_groups:server:getGroupMembers')
    cb(groupNames)
end)

RegisterNetEvent('slrn_groups:client:refreshGroups', function(groupData)
    exports['lb-phone']:SendCustomAppMessage(identifier, {
        action = 'setGroups',
        data = groupData,
    })
end)

RegisterNetEvent('slrn_groups:client:updateGroupStage', function(_, stage)
    groupStage = stage
    exports['lb-phone']:SendCustomAppMessage(identifier, {
        action = 'setGroupJobSteps',
        data = stage
    })
end)

RegisterNetEvent('slrn_groups:client:CustomNotification', function(header, msg)
    exports['lb-phone']:SendNotification({
        app = identifier,
        title = header,
        content = msg,
    })
end)

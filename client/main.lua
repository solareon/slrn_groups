---@diagnostic disable: lowercase-global

local identifier = 'slrn_groups'
local groupStage -- Stores group stage
local finishedNotify -- store answer to leave group

-- Bridge
if GetResourceState('qbx_core') == 'started' then
    function getPlayerData()
        return QBX.PlayerData
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
            ui = 'slrn_groups/ui/index.html',
            icon = 'https://cfx-nui-slrn_groups/ui/assets/icon.png'
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

local inJob = false
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

local function PhoneNotification(title, description, accept, deny)
    exports['lb-phone']:SendCustomAppMessage(identifier, {
        action = 'PhoneNotification',
        PhoneNotify = {
            title = title,
            text = description,
            accept = accept,
            deny = deny,
        },
    })
    finishedNotify = nil
    local timeout = 500
    while not finishedNotify and timeout > 0 do
        Wait(100)
        timeout -= 1
    end
    if not finishedNotify then return false end
    return finishedNotify == 'success' or false
end

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

RegisterNUICallback('GetGroupsApp', function(_, cb)
    lib.callback('slrn_groups:server:getAllGroups', false, function(getGroups)
        cb(getGroups)
    end)
end)

RegisterNetEvent('slrn_groups:client:RefreshGroupsApp', function(Groups, finish)
    if finish then inJob = false end
    if inJob then return end
    exports['lb-phone']:SendCustomAppMessage(identifier, {
        action = 'refreshApp',
        data = Groups,
    })
end)

RegisterNetEvent('slrn_groups:client:AddGroupStage', function(status, stage)
    inJob = true
    groupStage = stage
    exports['lb-phone']:SendCustomAppMessage(identifier, {
        action = 'addGroupStage',
        status = stage
    })
end)

RegisterNUICallback('jobcenter_CreateJobGroup', function(data, cb)
    TriggerServerEvent('slrn_groups:server:jobcenter_CreateJobGroup', data)
    cb('ok')
end)

RegisterNUICallback('AnsweredNotify', function(data, cb)
    finishedNotify = data.type
    cb('ok')
end)

RegisterNUICallback('onStartup', function(data, cb)
    exports['lb-phone']:SendCustomAppMessage(identifier, {
        action = 'LoadPhoneData',
        PlayerData = getPlayerData(),
    })
    if not inJob then
        exports['lb-phone']:SendCustomAppMessage(identifier, {
            action = 'LoadJobCenterApp',
        })
    else
        exports['lb-phone']:SendCustomAppMessage(identifier, {
            action = 'addGroupStage',
            status = groupStage
        })
    end
    cb('ok')
end)

RegisterNUICallback('jobcenter_JoinTheGroup', function(data, cb)
    local message = lib.callback.await('slrn_groups:server:jobcenter_JoinTheGroup')

    exports['lb-phone']:SendNotification({
        app = identifier,
        content = message,
    })

    cb('ok')
end)

RegisterNetEvent('slrn_groups:client:CustomNotification', function(header, msg)
    exports['lb-phone']:SendNotification({
        app = identifier,
        title = header,
        content = msg,
    })
end)

RegisterNUICallback('jobcenter_leave_grouped', function(_, cb)

    local success = PhoneNotification('Job Center', 'Are you sure you want to leave the group?', 'Accept', 'Deny')

    if success then
        local message = lib.callback.await('slrn_groups:server:jobcenter_leave_grouped')

        exports['lb-phone']:SendNotification({
            app = identifier,
            content = message,
        })
    end

    cb('ok')
end)

RegisterNUICallback('jobcenter_DeleteGroup', function(data, cb)
    local message = lib.callback.await('slrn_groups:server:jobcenter_DeleteGroup')

    exports['lb-phone']:SendNotification({
        app = identifier,
        content = message,
    })

    cb('ok')
end)

RegisterNUICallback('jobcenter_CheckPlayerNames', function(data, cb)
    local groupNames = lib.callback.await('slrn_groups:server:jobcenter_CheckPlayerNames')

    cb(groupNames)
end)

RegisterCommand('testpass', function()
    exports['lb-phone']:SendCustomAppMessage(identifier, {
        action = 'testPassword'
    })
end, false)

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
            ui = 'http://localhost:3000',
            icon = 'https://cfx-nui-slrn_groups/ui/dist/icon.svg'
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

RegisterNuiCallback('getPlayerData', function(_, cb)
    local citizenId = getPlayerData()
    local playerData = {
        source = cache.serverId,
        citizenId = citizenId
    }
    cb(playerData)
end)

RegisterNuiCallback('getGroupData', function(_, cb)
    local groups, inGroup, groupStatus, groupStages = lib.callback.await('slrn_groups:server:getAllGroups')
    if groups then
        cb(groups)
    end
    exports['lb-phone']:SendCustomAppMessage(identifier, {
        action = 'setInGroup',
        data = inGroup and true or false
    })
    lib.callback('slrn_groups:server:getGroupMembersNames', false, function(groupData)
        lib.print.error('currentGroupData')
        lib.print.error(groupData)
        exports['lb-phone']:SendCustomAppMessage(identifier, {
            action = 'setCurrentGroup',
            data = groupData or {}
        })
    end)
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
    -- cb({})
end)

RegisterNuiCallback('createGroup', function(data, cb)
    TriggerServerEvent('slrn_groups:server:createGroup', data)
    cb('ok')
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
    local groupNames = lib.callback.await('slrn_groups:server:getGroupMembersNames')
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

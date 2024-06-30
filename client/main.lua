local identifier = 'slrn_groups'

local function sendCustomAppMessage(action, data)
    exports['lb-phone']:SendCustomAppMessage(
        identifier, {
            action = action,
            data = data
    })
end

local function sendNotification(message, title)
    exports['lb-phone']:SendNotification({
        app = identifier,
        title = title or nil,
        content = message,
    })
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
            ui = GetCurrentResourceName() .. "/ui/dist/index.html",
            -- ui = "http://localhost:3000", -- for local ui build testing
            icon = "https://cfx-nui-" .. GetCurrentResourceName() .. "/ui/public/icon.svg",
            fixBlur = true,
            onUse = function()
                lib.callback('slrn_groups:server:getSetupAppData', false, function(setupAppData)
                    sendCustomAppMessage('setupApp', setupAppData)
                    if setupAppData.groupStatus == 'IN_PROGRESS' then
                        sendCustomAppMessage('startJob', {})
                    end
                end)
            end,
            images = { -- OPTIONAL array of screenshots of the app, used for showcasing the app
            "https://cfx-nui-" .. GetCurrentResourceName() .. "/ui/public/screenshot-light.png",
            "https://cfx-nui-" .. GetCurrentResourceName() .. "/ui/public/screenshot-dark.png"
        },
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
    local playerData = {
        source = cache.serverId,
    }
    cb(playerData)
end)

RegisterNuiCallback('getGroupData', function(_, cb)
    --noop
end)

RegisterNuiCallback('getGroupJobSteps', function(_, cb)
    local groupStages = lib.callback.await('slrn_groups:server:getGroupJobSteps')
    cb(groupStages)
end)

RegisterNuiCallback('createGroup', function(data, cb)
    TriggerServerEvent('slrn_groups:server:createGroup', data)
    cb({})
end)

RegisterNuiCallback('joinGroup', function(data, cb)
    local message = lib.callback.await('slrn_groups:server:joinGroup', false, data)
    sendNotification(message)
    cb({})
end)

RegisterNuiCallback('leaveGroup', function(_, cb)
    local message = lib.callback.await('slrn_groups:server:leaveGroup')
    sendNotification(message)
    cb({})
end)

RegisterNuiCallback('deleteGroup', function(_, cb)
    local message = lib.callback.await('slrn_groups:server:deleteGroup')
    sendNotification(message)
    cb({})
end)

RegisterNUICallback('getMemberList', function(_, cb)
    local groupNames = lib.callback.await('slrn_groups:server:getGroupMembersNames')
    cb(groupNames)
end)

RegisterNUICallback('removeGroupMember', function (data, cb)
    local message = lib.callback.await('slrn_groups:server:removeGroupMember', false, data)
    sendNotification(message)
    cb({})
end)

RegisterNetEvent('slrn_groups:client:refreshGroups', function(groupData)
    local currentGroupData, inGroup = lib.callback.await('slrn_groups:server:getGroupMembersNames', false)
    sendCustomAppMessage('setCurrentGroup', currentGroupData or {})
    sendCustomAppMessage('setInGroup', inGroup or false)
    sendCustomAppMessage('setGroups', groupData)
end)

RegisterNetEvent('slrn_groups:client:updateGroupStage', function(_, stage)
    sendCustomAppMessage('setGroupJobSteps', stage)
end)

RegisterNetEvent('slrn_groups:client:CustomNotification', function(header, msg)
    sendNotification(msg, header)
end)
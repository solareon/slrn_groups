local identifier = 'slrn_groups'
local standaloneOpen = false
local themeKvp = 'standaloneTheme'

local function hasPhone()
    return GetResourceState('lb-phone') ~= 'missing'
end

local function getStandaloneTheme()
    return GetResourceKvpString(themeKvp) == 'dark' and 'dark' or 'light'
end

local function sendCustomAppMessage(action, data)
    local message = { action = action, data = data }
    if hasPhone() then
        exports['lb-phone']:SendCustomAppMessage(identifier, message)
    else
        SendNUIMessage(message)
    end
end

local function sendNotification(message, title)
    if hasPhone() then
        exports['lb-phone']:SendNotification({ app = identifier, title = title, content = message })
    else
        sendCustomAppMessage('sendNotification', { title = title or 'Groups', message = message })
    end
end

local function setupApp()
    lib.callback('slrn_groups:server:getSetupAppData', false, function(data)
        data.groupJobSteps = data.groupJobSteps or data.groupStages or {}
        Wait(100)
        sendCustomAppMessage('setupApp', data)
        if data.groupStatus == 'IN_PROGRESS' then sendCustomAppMessage('startJob', {}) end
    end)
end

local function setStandaloneOpen(open)
    standaloneOpen = open
    SetNuiFocus(open, open)
    SendNUIMessage({ action = 'standalone:setVisible', data = { visible = open, theme = getStandaloneTheme() } })
end

local function addPhoneApp()
    if not hasPhone() then return end
    local added, errorMessage = exports['lb-phone']:AddCustomApp({
        identifier = identifier,
        name = 'Groups',
        description = 'Group app to do stuff together',
        developer = 'solareon',
        defaultApp = true,
        ui = 'slrn_groups/web/build/index.html',
        icon = 'https://cfx-nui-slrn_groups/web/build/icon.svg',
        fixBlur = true,
        onUse = setupApp,
        images = {
            'https://cfx-nui-slrn_groups/web/build/screenshot-light.png',
            'https://cfx-nui-slrn_groups/web/build/screenshot-dark.png',
        },
    })
    if not added then print('Could not add app:', errorMessage) end
end

CreateThread(function()
    if hasPhone() then addPhoneApp() end
end)

RegisterCommand('groups', function()
    if hasPhone() then setupApp() return end
    setStandaloneOpen(not standaloneOpen)
    if standaloneOpen then setupApp() end
end, false)

RegisterKeyMapping('groups', 'Open Groups', 'keyboard', 'F7')

RegisterNuiCallback('getPlayerData', function(_, cb) cb({ source = cache.serverId }) end)
RegisterNuiCallback('getGroupData', function(_, cb) cb({}) end)
RegisterNuiCallback('getGroupJobSteps', function(_, cb)
    cb(lib.callback.await('slrn_groups:server:getGroupJobSteps') or {})
end)
RegisterNuiCallback('closeStandalone', function(_, cb)
    setStandaloneOpen(false)
    cb(true)
end)
RegisterNuiCallback('setStandaloneTheme', function(theme, cb)
    if theme ~= 'light' and theme ~= 'dark' then cb(false) return end
    SetResourceKvp(themeKvp, theme)
    cb(true)
end)
RegisterNuiCallback('createGroup', function(data, cb)
    TriggerServerEvent('slrn_groups:server:createGroup', data)
    cb({})
end)
RegisterNuiCallback('joinGroup', function(data, cb)
    sendNotification(lib.callback.await('slrn_groups:server:joinGroup', false, data))
    cb({})
end)
RegisterNuiCallback('leaveGroup', function(_, cb)
    sendNotification(lib.callback.await('slrn_groups:server:leaveGroup'))
    cb({})
end)
RegisterNuiCallback('deleteGroup', function(_, cb)
    sendNotification(lib.callback.await('slrn_groups:server:deleteGroup'))
    cb({})
end)
RegisterNuiCallback('getMemberList', function(_, cb)
    cb(lib.callback.await('slrn_groups:server:getGroupMembersNames') or {})
end)
RegisterNuiCallback('removeGroupMember', function(data, cb)
    sendNotification(lib.callback.await('slrn_groups:server:removeGroupMember', false, data))
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

AddEventHandler('onResourceStart', function(resource)
    if resource == 'lb-phone' then
        if standaloneOpen then setStandaloneOpen(false) end
        addPhoneApp()
    end
end)
AddEventHandler('onResourceStop', function(resource)
    if resource == GetCurrentResourceName() and standaloneOpen then SetNuiFocus(false, false) end
end)

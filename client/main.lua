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
    SendNotification(message)
    cb({})
end)

RegisterNuiCallback('leaveGroup', function(_, cb)
    local message = lib.callback.await('slrn_groups:server:leaveGroup')
    SendNotification(message)
    cb({})
end)

RegisterNuiCallback('deleteGroup', function(_, cb)
    local message = lib.callback.await('slrn_groups:server:deleteGroup')
    SendNotification(message)
    cb({})
end)

RegisterNUICallback('getMemberList', function(_, cb)
    local groupNames = lib.callback.await('slrn_groups:server:getGroupMembersNames')
    cb(groupNames)
end)

RegisterNUICallback('removeGroupMember', function (data, cb)
    local message = lib.callback.await('slrn_groups:server:removeGroupMember', false, data)
    SendNotification(message)
    cb({})
end)

RegisterNetEvent('slrn_groups:client:refreshGroups', function(groupData)
    local currentGroupData, inGroup = lib.callback.await('slrn_groups:server:getGroupMembersNames', false)
    SendReactMessage('setCurrentGroup', currentGroupData or {})
    SendReactMessage('setInGroup', inGroup or false)
    SendReactMessage('setGroups', groupData)
end)

RegisterNetEvent('slrn_groups:client:updateGroupStage', function(_, stage)
    SendReactMessage('setGroupJobSteps', stage)
end)

RegisterNetEvent('slrn_groups:client:CustomNotification', function(header, msg)
    SendNotification(msg, header)
end)
local api = require 'server.api'

lib.callback.register('slrn_groups:server:removeGroupMember', function(source, targetId)
    local groupId = api.GetGroupByMembers(source)

    if groupId then
        if api.isGroupLeader(source, groupId) then
            if api.RemovePlayerFromGroup(targetId, groupId) then
                return 'Removed '..GetPlayerName(targetId).. ' from the group'
            end
        end
    end

    return 'Error removing player'
end)

lib.callback.register('slrn_groups:server:promoteGroupMember', function(source, targetId)
    local groupId = api.GetGroupByMembers(source)

    if groupId then
        if api.isGroupLeader(source, groupId) then
            if api.ChangeGroupLeader(groupId, targetId) then
                return 'Promoted '..GetPlayerName(targetId).. ' to Leader'
            end
        end
    end

    return 'Error promoting player'
end)

lib.callback.register('slrn_groups:server:deleteGroup', function(source)
    local groupId = api.GetGroupByMembers(source)

    if groupId then
        if api.isGroupLeader(source, groupId) then
            api.DestroyGroup(groupId)

            return 'Group Deleted'
        else
            if api.RemovePlayerFromGroup(source, groupId) then
                return 'Left Group'
            end
        end
    end

    return 'Error leaving group'
end)

---Joins a specific group if the password is correct
---@param source number
---@param data {id: number, pass: string}
lib.callback.register('slrn_groups:server:joinGroup', function(source, data)
    if api.isPasswordCorrect(data.id, data.pass) then

        api.pNotifyGroup(data.id, 'Groups', GetPlayerName(source)..' has joined the group!')

        api.AddMember(data.id, source)

        return 'You joined the group'
    else
        return 'Invalid Password'
    end
end)

lib.callback.register('slrn_groups:server:leaveGroup', function(source)
    local groupId = api.GetGroupByMembers(source)

    if groupId then
        api.RemovePlayerFromGroup(source, groupId)

        return 'Left Group'
    end
end)


---Creates a new group
---@param data {name: string, pass: string}
RegisterNetEvent('slrn_groups:server:createGroup', function(data)
    api.CreateGroup(source, data.name, data.pass)
end)


---Gets all the player names of the players in the group
---@param source number
---@return table?
lib.callback.register('slrn_groups:server:getGroupMembers', function(source)
    local groupId = api.GetGroupByMembers(source)

    if groupId then
        return api.getGroupMembers(groupId)
    end
end)

---Gets all the player names of the players in the group
---@param source number
---@return table?
---@return number | boolean?
lib.callback.register('slrn_groups:server:getGroupMembersNames', function(source)
    local groupId = api.GetGroupByMembers(source)

    if groupId then
        return api.GetGroupMembersNames(groupId), groupId or false
    end
end)


---Get app startup data
---@param source number
---@return table
lib.callback.register('slrn_groups:server:getSetupAppData', function(source)
    local groupId = api.GetGroupByMembers(source)
    local setupAppData = {
        playerData = {
            source = source,
        },
        groups = api.GetAllGroups() or {},
        inGroup = groupId or false,
        groupData = groupId and api.GetGroupMembersNames(groupId) or {},
        groupStages = groupId and api.GetGroupStages(groupId) or {},
        groupStatus = groupId and api.getJobStatus(groupId) or false,
    }
    return setupAppData
end)

---Get group stages
---@param source number
---@return table?
lib.callback.register('slrn_groups:server:getGroupJobSteps', function(source)
    local groupId = api.GetGroupByMembers(source)

    if groupId then
        return api.GetGroupStages(groupId)
    end
end)


AddEventHandler('playerDropped', function()
    local groupId = api.GetGroupByMembers(source)

    if groupId then
        if api.isGroupLeader(source, groupId) then
            if api.ChangeGroupLeader(groupId) then
                api.RemovePlayerFromGroup(source, groupId)
            else
                api.DestroyGroup(groupId)
            end
        else
            api.RemovePlayerFromGroup(source, groupId)
        end
    end
end)

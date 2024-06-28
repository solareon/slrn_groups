local api = require 'server.api'

lib.callback.register('slrn_groups:server:removeGroupMember', function(source, data)
    local groupId = api.GetGroupByMembers(source)

    if groupId then
        if api.isGroupLeader(source, groupId) then
            if api.RemovePlayerFromGroup(data.target, groupId) then
                return 'Removed Player'
            end
        end
    end

    return 'Error removing player'
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
    local groupID = api.GetGroupByMembers(source)

    if groupID then
        api.RemovePlayerFromGroup(source, groupID)

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
        lib.print.error('Getting Group Members')
        lib.print.error(api.getGroupMembers(groupId))
        return api.getGroupMembers(groupId)
    end
end)

---Gets all the player names of the players in the group
---@param source number
---@return table?
---@return number | boolean
lib.callback.register('slrn_groups:server:getGroupMembersNames', function(source)
    local groupId = api.GetGroupByMembers(source)

    if groupId then
        lib.print.error('Getting Group Members Names')
        lib.print.error(api.GetGroupMembersNames(groupId))
        return api.GetGroupMembersNames(groupId), groupId or false
    end
end)


---Get all groups
---@param source number
lib.callback.register('slrn_groups:server:getAllGroups', function(source)
    local groupId = api.GetGroupByMembers(source)
    lib.print.error('Getting All Groups')
    lib.print.error(api.GetAllGroups())

    if groupId then
        return api.GetAllGroups(), groupId, api.getJobStatus(groupId), api.GetGroupStages(groupId)
    else
        return api.GetAllGroups(), false
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

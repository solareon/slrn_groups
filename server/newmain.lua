local api = require 'server.api'



lib.callback.register('slrn_groups:server:jobcenter_DeleteGroup', function(source)
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

lib.callback.reigster('slrn_groups:server:jobcenter_DeleteGroup', function(source)
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
lib.callback.register('slrn_groups:server:jobcenter_JoinTheGroup', function(source, data)
    if api.isPasswordCorrect(data.id, data.pass) then
        -- #TODO: Get the name from the bridge for the Notification
        api.pNotifyGroup(data.id, 'Job Center', source..' Has joined the group')

        api.addMember(data.id, source)

        return 'You joined the group'
    else
        return 'Invalid Password'
    end
end)

lib.callback.register('slrn_groups:server:jobcenter_leave_grouped', function(source)
    local groupID = api.GetGroupByMembers(source)

    if groupID then
        api.RemovePlayerFromGroup(source, groupID)

        return 'Left Group'
    end
end)


---Creates a new group
---@param data {name: string, pass: string}
RegisterNetEvent('slrn_groups:server:jobcenter_CreateJobGroup', function(data)
    api.CreateGroup(source, data.name, data.pass)
end)


---Gets all the player names of the players in the group
---@param source number
---@return table?
lib.callback.register('slrn_groups:server:jobcenter_CheckPlayerNames', function(source)
    local groupId = api.GetGroupByMembers(source)

    if groupId then
        return api.GetGroupMembersNames(groupId)
    end
end)



---Get all groups
---@param source number
lib.callback.register('slrn_groups:server:getAllGroups', function(source)
    local groupId = api.GetGroupByMembers(source)

    if groupId then
        return api.GetAllGroups(), true, api.getJobStatus(groupId), api.GetGroupStages(groupId)
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

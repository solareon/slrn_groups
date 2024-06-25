local group_class = require 'server.groups'
local utils = require 'server.utils'

---@type table<number, groups>
local groups = {}

local api = {}

--- Notifies all members of a group with a message
---@param groupID number
---@param msg string
---@param type string
function api.NotifyGroup(groupID, msg, type)
    local group = groups[groupID]

    if not group then
        return lib.print.error('NotifyGroup was sent an invalid groupID :'..groupID)
    end

    for i = 1, #group.members do
        utils.notify(group.members[i].Player, msg, type)
    end
end
utils.exportHandler('NotifyGroup', api.NotifyGroup)

--- Notifies all members of a group with a custom notification
---@param groupID number
---@param header string
---@param msg string
function api.pNotifyGroup(groupID, header, msg)
    local group = groups[groupID]

    if not group then
        return lib.print.error('pNotifyGroup was sent an invalid groupID :'..groupID)
    end

    lib.triggerClientEvent('slrn_groups:client:CustomNotification', group:getGroupMembers(),
        header or 'NO HEADER',
        msg or 'NO MSG'
    )
end
utils.exportHandler('pNotifyGroup', api.pNotifyGroup)

---@class BlipData
---@field entity number
---@field netId number
---@field radius number
---@field coords vector3
---@field color number
---@field alpha number
---@field sprite number
---@field scale number
---@field label string
---@field route boolean
---@field routeColor number

--- Creates a blip for all members of a group
---@param groupID number
---@param name string
---@param data BlipData
function api.CreateBlipForGroup(groupID, name, data)
    local group = groups[groupID]

    if not group then
        return lib.print.error('CreateBlipForGroup was sent an invalid groupID :'..groupID)
    end

    lib.triggerClientEvent('groups:createBlip', group:getGroupMembers(), name, data)
end
utils.exportHandler('CreateBlipForGroup', api.CreateBlipForGroup)

--- Removes a blip for all members of a group
---@param groupID number
---@param name string
function api.RemoveBlipForGroup(groupID, name)
    local group = groups[groupID]

    if not group then
        return lib.print.error('RemoveBlipForGroup was sent an invalid groupID :'..groupID)
    end

    lib.triggerClientEvent('slrn_groups:client:RemoveBlipForGroup', group:getGroupMembers(), name)
end
utils.exportHandler('RemoveBlipForGroup', api.RemoveBlipForGroup)

--- Returns the group ID by member's source
---@param src number
---@return number?
function api.GetGroupByMembers(src)
    if src then
        for i = 1, #groups do
            for j = 1, #groups[i].members do
                if groups[i].members[j].Player == src then
                    return i
                end
            end
        end
    end
end
utils.exportHandler('GetGroupByMembers', api.GetGroupByMembers)

--- Returns the group members of a given group
---@param groupID number
---@return number[]?
function api.getGroupMembers(groupID)
    local group = groups[groupID]

    if not group then
        return lib.print.error('getGroupMembers was sent an invalid groupID :'..groupID)
    end

    return group:getGroupMembers()
end
utils.exportHandler('getGroupMembers', api.getGroupMembers)

--- Returns the number of members in a given group
---@param groupID number
---@return number?
function api.getGroupSize(groupID)
    local group = groups[groupID]

    if not group then
        return lib.print.error('getGroupSize was sent an invalid groupID :'..groupID)
    end

    return #group.members
end
utils.exportHandler('getGroupSize', api.getGroupSize)

--- Returns the leader of a group
---@param groupID number
---@return number?
function api.GetGroupLeader(groupID)
    local group = groups[groupID]

    if not group then
        return lib.print.error('GetGroupLeader was sent an invalid groupID :'..groupID)
    end

    return group.leader
end
utils.exportHandler('GetGroupLeader', api.GetGroupLeader)

--- Destroys a group and removes it from the array
---@param groupID number
function api.DestroyGroup(groupID)
    local group = groups[groupID]

    if not group then
        return lib.print.error('DestroyGroup was sent an invalid groupID :'..groupID)
    end

    -- If more than just the leader is in the group, notify all members that the group has been disbanded
    if #group.members > 1 then
        for i = 1, #group.members do
            local source = group.members[i].Player

            if source ~= group.leader then
                utils.notify(group.members[i].Player, 'The group has been disbanded', 'error')
            end
        end
    end

    table.remove(groups, groupID)

    TriggerEvent('slrn_groups:server:GroupDeleted', groupID, groups:getGroupMembers())
    TriggerClientEvent('slrn_groups:client:RefreshGroupsApp', -1, groups)
end
utils.exportHandler('DestroyGroup', api.DestroyGroup)

function api.AddMember(groupID, source)
    local group = groups[groupID]

    if not group then
        return lib.print.error('AddMember was sent an invalid groupID :'..groupID)
    end

    group:addMember(source)

    TriggerClientEvent('slrn_groups:client:RefreshGroupsApp', -1, groups)
end
utils.exportHandler('AddMember', api.AddMember)

---Checks if the password a user entered is the same as the group password
---@param groupId number
---@param password string
---@return boolean?
function api.isPasswordCorrect(groupId, password)
    local group = groups?[groupId]

    if not group then
        return lib.print.error('isPasswordCorrect was sent an invalid groupID :'..groupId)
    end

    return groups:getPassword() == password
end



--- Checks if the player is the leader in the group
---@param src number
---@param groupID number
---@return boolean?
function api.isGroupLeader(src, groupID)
    local group = groups[groupID]

    if not group then
        return lib.print.error('isGroupLeader was sent an invalid groupID :'..groupID)
    end

    return group.leader == src
end
utils.exportHandler('isGroupLeader', api.isGroupLeader)


---Removes a player from a group
---@param source number
---@param groupID number
---@return boolean?
function api.RemovePlayerFromGroup(source, groupID)
    local group = groups[groupID]

    if not group then
        return lib.print.error('RemovePlayerFromGroup was sent an invalid groupID :'..groupID)
    end

    for i = 1, #group.members do
        local member = group.members[i]

        if member.Player == source then
            table.remove(group.members, i)

            TriggerClientEvent('slrn_groups:client:RefreshGroupsApp', -1, groups)

            return true
        end
    end

    return false
end

--- Sets the group status and stages
---@param groupID number
---@param status 'WAITING' | 'IN_PROGRESS' | 'DONE'
---@param stages {id: number, name: string, isDone: boolean}[]
function api.setJobStatus(groupID, status, stages)
    local group = groups[groupID]

    if not group then
        return lib.print.error('setJobStatus was sent an invalid groupID :'..groupID)
    end

    group.status = status
    group.stage = stages

    lib.triggerClientEvent('slrn_groups:client:AddGroupStage', group:getGroupMembers(), status, stages)
end
utils.exportHandler('setJobStatus', api.setJobStatus)

--- Returns the group status
---@param groupID number
---@return 'WAITING' | 'IN_PROGRESS' | 'DONE' | nil
function api.getJobStatus(groupID)
    local group = groups[groupID]

    if not group then
        return lib.print.error('getJobStatus was sent an invalid groupID :'..groupID)
    end

    return group.status
end
utils.exportHandler('getJobStatus', api.getJobStatus)

--- Resets the group status and stages
---@param groupID number
function api.resetJobStatus(groupID)
    local group = groups[groupID]

    if not group then
        return lib.print.error('resetJobStatus was sent an invalid groupID :'..groupID)
    end

    group.status = 'WAITING'
    group.stage = {}

    group:refreshGroupStages()
end
utils.exportHandler('resetJobStatus', api.resetJobStatus)

--- Returns the group current stages
---@param groupID number
---@return {id: number, name: string, isDone: boolean}[]?
function api.GetGroupStages(groupID)
    local group = groups[groupID]

    if not group then
        return lib.print.error('GetGroupStages was sent an invalid groupID :'..groupID)
    end

    return group.stage
end
utils.exportHandler('GetGroupStages', api.GetGroupStages)

--- Returns whether or not the group is created by a script
---@param groupID number
---@return boolean?
function api.isGroupTemp(groupID)
    local group = groups[groupID]

    if not group then
        return lib.print.error('isGroupTemp was sent an invalid groupID :'..groupID)
    end

    return group.ScriptCreated or false
end
utils.exportHandler('isGroupTemp', api.isGroupTemp)

--- Creates a new group
---@param src number
---@param name string
---@param password string?
---@return number
function api.CreateGroup(src, name, password)
    local id = #groups + 1

    local group = group_class:new(id, name, password, src, true)

    groups[id] = group

    -- Send non-sensitive data to all clients (id, name, memberCount)
    TriggerClientEvent('slrn_groups:client:RefreshGroupsApp', -1, group.getClientData())

    return id
end
utils.exportHandler('CreateGroup', api.CreateGroup)

return api

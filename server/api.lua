local group_class = require 'server.groups'
local utils = require 'server.utils'

---@type table<number, groups>
local groups = {}

local api = {}

local groupIndex = 0

--- Returns the group table index by ID
---@param id number
---@return group?
function api.findGroupById(id)
    for i=1, #groups do
        if groups[i].id == id then
            return groups[i]
        end
    end
end

--- Notifies all members of a group with a message
---@param groupId number
---@param msg string
---@param type string
function api.NotifyGroup(groupId, msg, type)
    local group = api.findGroupById(groupId)

    if not group then
        return lib.print.error('NotifyGroup was sent an invalid groupId :'..groupId)
    end

    for i = 1, #group.members do
        utils.notify(group.members[i].playerId, msg, type)
    end
end
utils.exportHandler('NotifyGroup', api.NotifyGroup)

--- Notifies all members of a group with a custom notification
---@param groupId number
---@param header string
---@param msg string
function api.pNotifyGroup(groupId, header, msg)
    local group = api.findGroupById(groupId)

    if not group then
        return lib.print.error('pNotifyGroup was sent an invalid groupId :'..groupId)
    end

    group:triggerGroupEvent('slrn_groups:client:CustomNotification', header or 'NO HEADER', msg or 'NO MSG')
end
utils.exportHandler('pNotifyGroup', api.pNotifyGroup)

---Triggers a client event for each member of a group (stolen from ox_lib)
---@param eventName string
---@param groupId number
---@param ... any
function api.triggerGroupEvent(eventName, groupId, ...)
    local group = api.findGroupById(groupId)

    if not group then
        return lib.print.error('triggerGroupEvent was sent an invalid groupId :'..groupId)
    end

    group:triggerGroupEvent(eventName, ...)
end
utils.exportHandler('triggerGroupEvent', api.triggerGroupEvent)

---@class BlipData
---@field entity number?
---@field netId number?
---@field radius number?
---@field coords vector3?
---@field color number?
---@field alpha number?
---@field sprite number?
---@field scale number?
---@field label string?
---@field route boolean?
---@field routeColor number?

--- Creates a blip for all members of a group
---@param groupId number
---@param name string
---@param data BlipData
function api.CreateBlipForGroup(groupId, name, data)
    local group = api.findGroupById(groupId)

    if not group then
        return lib.print.error('CreateBlipForGroup was sent an invalid groupId :'..groupId)
    end

    group:triggerGroupEvent('groups:createBlip', name, data)
end
utils.exportHandler('CreateBlipForGroup', api.CreateBlipForGroup)

--- Removes a blip for all members of a group
---@param groupId number
---@param name string
function api.RemoveBlipForGroup(groupId, name)
    local group = api.findGroupById(groupId)

    if not group then
        return lib.print.error('RemoveBlipForGroup was sent an invalid groupId :'..groupId)
    end

    group:triggerGroupEvent('groups:removeBlip', name)
end
utils.exportHandler('RemoveBlipForGroup', api.RemoveBlipForGroup)

--- Returns the group ID by member's source
---@param src number
---@return number?
function api.GetGroupByMembers(src)
    if src then
        for i = 1, #groups do
            for j = 1, #groups[i].members do
                if groups[i].members[j].playerId == src then
                    return groups[i].id
                end
            end
        end
    end
end
utils.exportHandler('GetGroupByMembers', api.GetGroupByMembers)

--- Returns the group members of a given group
---@param groupId number
---@return number[]?
function api.getGroupMembers(groupId)
    local group = api.findGroupById(groupId)

    if not group then
        return lib.print.error('getGroupMembers was sent an invalid groupId :'..groupId)
    end

    return group:getGroupMembers()
end
utils.exportHandler('getGroupMembers', api.getGroupMembers)

--- Returns the number of members in a given group
---@param groupId number
---@return number?
function api.getGroupSize(groupId)
    local group = api.findGroupById(groupId)

    if not group then
        return lib.print.error('getGroupSize was sent an invalid groupId :'..groupId)
    end

    return #group.members
end
utils.exportHandler('getGroupSize', api.getGroupSize)

--- Returns the leader of a group
---@param groupId number
---@return number?
function api.GetGroupLeader(groupId)
    local group = api.findGroupById(groupId)

    if not group then
        return lib.print.error('GetGroupLeader was sent an invalid groupId :'..groupId)
    end

    return group.leader
end
utils.exportHandler('GetGroupLeader', api.GetGroupLeader)

--- Destroys a group and removes it from the array
---@param groupId number
function api.DestroyGroup(groupId)
    local group = api.findGroupById(groupId)

    if not group then
        return lib.print.error('DestroyGroup was sent an invalid groupId :'..groupId)
    end

    -- If more than just the leader is in the group, notify all members that the group has been disbanded
    if #group.members > 1 then
        for i = 1, #group.members do
            local source = group.members[i].playerId

            if source ~= group.leader then
                utils.notify(group.members[i].playerId, 'The group has been disbanded', 'error')
            end
        end
    end

    for i = 1, #groups do
        if groups[i].id == groupId then
            table.remove(groups, i)
            break
        end
    end

    TriggerEvent('slrn_groups:server:GroupDeleted', groupId, group:getGroupMembers())
    lib.triggerClientEvent('slrn_groups:client:refreshGroups', -1, api.GetAllGroups())
end
utils.exportHandler('DestroyGroup', api.DestroyGroup)

function api.AddMember(groupId, source)
    local group = api.findGroupById(groupId)

    if not group then
        return lib.print.error('AddMember was sent an invalid groupId :'..groupId)
    end

    group:addMember(source)

    lib.triggerClientEvent('slrn_groups:client:refreshGroups', -1, api.GetAllGroups())
end
utils.exportHandler('AddMember', api.AddMember)

---Checks if the password a user entered is the same as the group password
---@param groupId number
---@param password string
---@return boolean?
function api.isPasswordCorrect(groupId, password)
    local group = groups?[groupId]

    if not group then
        return lib.print.error('isPasswordCorrect was sent an invalid groupId :'..groupId)
    end

    return group:getPassword() == password
end



--- Checks if the player is the leader in the group
---@param src number
---@param groupId number
---@return boolean?
function api.isGroupLeader(src, groupId)
    local group = api.findGroupById(groupId)

    if not group then
        return lib.print.error('isGroupLeader was sent an invalid groupId :'..groupId)
    end

    return group.leader == src
end
utils.exportHandler('isGroupLeader', api.isGroupLeader)


---Removes a player from a group
---@param source number
---@param groupId number
---@return boolean?
function api.RemovePlayerFromGroup(source, groupId)
    local group = api.findGroupById(groupId)

    if not group then
        return lib.print.error('RemovePlayerFromGroup was sent an invalid groupId :'..groupId)
    end


    local memberCount = #group.members
    for i = 1, memberCount do
        local member = group.members[i]

        if member.playerId == source then
            table.remove(group.members, i)

            lib.triggerClientEvent('slrn_groups:client:refreshGroups', -1, api.GetAllGroups())

            -- There are no more members in the group, destroy it
            if memberCount == 1 then
                api.DestroyGroup(groupId)
            end

            return true
        end
    end

    return false
end

--- Sets the group status and stages
---@param groupId number
---@param status 'WAITING' | 'IN_PROGRESS' | 'DONE'
---@param stages {id: number, name: string, isDone: boolean}[]
function api.setJobStatus(groupId, status, stages)
    local group = api.findGroupById(groupId)

    if not group then
        return lib.print.error('setJobStatus was sent an invalid groupId :'..groupId)
    end

    group.status = status
    group.stage = stages

    group:triggerGroupEvent('slrn_groups:client:updateGroupStage', status, stages)
end
utils.exportHandler('setJobStatus', api.setJobStatus)

--- Returns the group status
---@param groupId number
---@return 'WAITING' | 'IN_PROGRESS' | 'DONE' | nil
function api.getJobStatus(groupId)
    local group = api.findGroupById(groupId)

    if not group then
        return lib.print.error('getJobStatus was sent an invalid groupId :'..groupId)
    end

    return group.status
end
utils.exportHandler('getJobStatus', api.getJobStatus)

--- Resets the group status and stages
---@param groupId number
function api.resetJobStatus(groupId)
    local group = api.findGroupById(groupId)

    if not group then
        return lib.print.error('resetJobStatus was sent an invalid groupId :'..groupId)
    end

    group.status = 'WAITING'
    group.stage = {}

    group:refreshGroupStages()
end
utils.exportHandler('resetJobStatus', api.resetJobStatus)

--- Returns the group current stages
---@param groupId number
---@return {id: number, name: string, isDone: boolean}[]?
function api.GetGroupStages(groupId)
    local group = api.findGroupById(groupId)

    if not group then
        return lib.print.error('GetGroupStages was sent an invalid groupId :'..groupId)
    end

    return group.stage
end
utils.exportHandler('GetGroupStages', api.GetGroupStages)

--- Returns whether or not the group is created by a script
---@param groupId number
---@return boolean?
function api.isGroupTemp(groupId)
    local group = api.findGroupById(groupId)

    if not group then
        return lib.print.error('isGroupTemp was sent an invalid groupId :'..groupId)
    end

    return group.ScriptCreated or false
end
utils.exportHandler('isGroupTemp', api.isGroupTemp)


---Gets all the groups thats currently running in the server
---@return {id: number, name: string, memberCount: number}[]
function api.GetAllGroups()
    local data = {}

    for i = 1, #groups do
        data[i] = groups[i]:getClientData()
    end

    return data
end
utils.exportHandler('getAllGroups', api.GetAllGroups)

--- Returns the group member names
---@param groupId number
---@return string[]?
function api.GetGroupMembersNames(groupId)
    local group = api.findGroupById(groupId)

    if not group then
        return lib.print.error('GetGroupMembersNames was sent an invalid groupId :'..groupId)
    end

    local members = {}

    for i = 1, #group.members do
        local member = group.members[i]

        members[i] = {
            name = member.name,
            playerId = member.playerId,
            isLeader = member.playerId == group.leader
        }
    end

    return members
end
utils.exportHandler('GetGroupMembersNames', api.GetGroupMembersNames)

--- Changes the leader of a group
---@param groupId number
---@return boolean?
function api.ChangeGroupLeader(groupId)
    local group = api.findGroupById(groupId)

    if not group then
        return lib.print.error('ChangeGroupLeader was sent an invalid groupId :'..groupId)
    end

    local members = group.members

    if #members > 1 then
        for i = 1, #members do
            if members[i].playerId ~= group.leader then
                group.leader = members[i].playerId
                return true
            end
        end
    end

    return false
end

--- Creates a new group
---@param src number
---@param name string
---@param password string?
---@return number
function api.CreateGroup(src, name, password)
    groupIndex = groupIndex + 1
    local id = groupIndex

    local group = group_class:new(id, name, password, src, true)

    groups[#groups + 1] = group

    -- Send non-sensitive data to all clients (id, name, memberCount)
    lib.triggerClientEvent('slrn_groups:client:refreshGroups', -1, api.GetAllGroups())

    return id
end
utils.exportHandler('CreateGroup', api.CreateGroup)

return api

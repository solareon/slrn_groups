local group_class = require 'server.groups'
local utils = require 'server.utils'

---@type table<number, groups>
local groups = {}

---Notifies all members of a group with a message
---@param groupID number
---@param msg string
---@param type string
local function NotifyGroup(groupID, msg, type)
    local group = groups[groupID]

    if not group then
        return lib.print.error('NotifyGroup was sent an invalid groupID :'..groupID)
    end

    for i = 1, #group.members do
        utils.notify(group.members[i].Player, msg, type)
    end
end
utils.exportHandler('NotifyGroup', NotifyGroup)

local function pNotifyGroup(groupID, header, msg)
    local group = groups?[groupID]

    if not group then
        return lib.print.error('getJobStatus was sent an invalid groupID :'..groupID)
    end

    lib.triggerClientEvent('slrn_groups:client:CustomNotification', group:getGroupMembers(),
        header or 'NO HEADER',
        msg or 'NO MSG'
    )
end
utils.exportHandler('pNotifyGroup', pNotifyGroup)

local function CreateBlipForGroup(groupID, name, data)
    local group = groups?[groupID]

    if not group then
        return lib.print.error('getJobStatus was sent an invalid groupID :'..groupID)
    end

    lib.triggerClientEvent('groups:createBlip', group:getGroupMembers(), name, data)
end
utils.exportHandler('CreateBlipForGroup', CreateBlipForGroup)

local function RemoveBlipForGroup(groupID, name)
    local group = groups?[groupID]

    if not group then
        return lib.print.error('getJobStatus was sent an invalid groupID :'..groupID)
    end

    lib.triggerClientEvent('slrn_groups:client:RemoveBlipForGroup', group:getGroupMembers(), name)
end
utils.exportHandler('RemoveBlipForGroup', RemoveBlipForGroup)


-- All group functions to get members leaders and size.
local function GetGroupByMembers(src)
    if  src then
        for i = 1, #groups do
            for j = 1, #groups[i].members do
                if groups[i].members[j].Player == src then
                    return i
                end
            end
        end
    end
end
utils.exportHandler('GetGroupByMembers', GetGroupByMembers)


---Returns the group members of a given group
---@param groupID number
---@return number[]?
local function getGroupMembers(groupID)
    local group = groups?[groupID]

    if not group then
        return lib.print.error('getJobStatus was sent an invalid groupID :'..groupID)
    end

    return group:getGroupMembers()
end
utils.exportHandler('getGroupMembers', getGroupMembers)


---Returns the group amount of members in a given group
---@param groupID number
---@return number?
local function getGroupSize(groupID)
    local group = groups?[groupID]

    if not group then
        return lib.print.error('getJobStatus was sent an invalid groupID :'..groupID)
    end

    return #group.members
end
utils.exportHandler('getGroupSize', getGroupSize)


---Returns the leader of a group
---@param groupID number
---@return number?
local function GetGroupLeader(groupID)
    local group = groups?[groupID]

    if not group then
        return lib.print.error('getJobStatus was sent an invalid groupID :'..groupID)
    end

    return group.leader
end
utils.exportHandler('GetGroupLeader', GetGroupLeader)


---Destroys a group and removes it from the array
---@param groupID number
local function DestroyGroup(groupID)
    local group = groups?[groupID]

    if not group then
        return lib.print.error('getJobStatus was sent an invalid groupID :'..groupID)
    end

    table.remove(groups, groupID)

    TriggerEvent('slrn_groups:server:GroupDeleted', groupID, groups:getGroupMembers())
    TriggerClientEvent('slrn_groups:client:RefreshGroupsApp', -1, groups)
end
utils.exportHandler('DestroyGroup', DestroyGroup)


---Checks if the player is the leader in the group
---@param src number
---@param groupID number
---@return boolean?
local function isGroupLeader(src, groupID)
    local group = groups?[groupID]

    if not group then
        return lib.print.error('getJobStatus was sent an invalid groupID :'..groupID)
    end

    return group.leader == src
end
utils.exportHandler('isGroupLeader', isGroupLeader)

---Sets the group status and stages
---@param groupID number
---@param status 'WAITING' | 'IN_PROGRESS' | 'DONE'
---@param stages {id: number, name: string, isDone: boolean}[]
local function setJobStatus(groupID, status, stages)
    local group = groups?[groupID]

    if not group then
        return lib.print.error('getJobStatus was sent an invalid groupID :'..groupID)
    end

    group.status = status
    group.stage = stages

    lib.triggerClientEvent('slrn_groups:client:AddGroupStage', group:getGroupMembers(), status, stages)
end
utils.exportHandler('setJobStatus', setJobStatus)


---Returns the group status
---@param groupID number
---@return 'WAITING' | 'IN_PROGRESS' | 'DONE' | nil
local function getJobStatus(groupID)
    local group = groups?[groupID]

    if not group then
        return lib.print.error('getJobStatus was sent an invalid groupID :'..groupID)
    end

    return group.status
end
utils.exportHandler('getJobStatus', getJobStatus)


---Resets the group status and stages
---@param groupID number
local function resetJobStatus(groupID)
    local group = groups?[groupID]

    if not group then
        return lib.print.error('setJobStatus was sent an invalid groupID :'..groupID)
    end

    group.status = 'WAITING'
    group.stage = {}

    group:refreshGroupStages()
end
utils.exportHandler('resetJobStatus', resetJobStatus)


---Returns the group currrent Stages
---@param groupID number
---@return {id: number, name: string, isDone: boolean}[]?
local function GetGroupStages(groupID)
    local group = groups?[groupID]

    if not group then
        return lib.print.error('GetGroupStages was sent an invalid groupID :'..groupID)
    end

    return group.stage
end
utils.exportHandler('GetGroupStages', GetGroupStages)


---Returns weather or not the group is created by a script
---@param groupID number
---@return boolean?
local function isGroupTemp(groupID)
    local group = groups?[groupID]

    if not group then
        return lib.print.error('isGroupTemp was sent an invalid groupID :'..groupID)
    end

    return group.ScriptCreated or false
end
utils.exportHandler('isGroupTemp', isGroupTemp)



---Creates a new group
---@param src number
---@param name string
---@param password string?
---@return number
local function CreateGroup(src, name, password)
    local id = #groups+1

    local group = group_class:new(id, name, password, src, true)

    groups[id] = group

    -- Send non-sensitive data to all clients (id, name, memberCount)
    TriggerClientEvent('slrn_groups:client:RefreshGroupsApp', -1, group.getClientData())

    return id
end
utils.exportHandler('CreateGroup', CreateGroup)

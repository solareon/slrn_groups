---@diagnostic disable: lowercase-global
if not lib then return end

lib.versionCheck('solareon/slrn_groups')

if GetCurrentResourceName() ~= 'slrn_groups' then
    lib.print.error('The resource needs to be named ^slrn_groups^7.')
    return
end

local playerData = {}
local playerGroup = {}

local function exportHandler(exportName, func)
    AddEventHandler(('__cfx_export_qb-phone_%s'):format(exportName), function(setCB)
        setCB(func)
    end)
    exports(exportName, func) -- support modern exports
end

-- Bridge
if GetResourceState('qbx_core') == 'started' then

    function getPlayer(id)
        return exports.qbx_core:GetPlayer(id)
    end

    function doNotification(src, text, nType)
        exports.qbx_core:Notify(src, text, nType)
    end
else -- Switch to QBox and save your sanity
    local QBCore = exports['qb-core']:GetCoreObject()

    function getPlayer(id)
        return QBCore.Functions.GetPlayer(id)
    end

    function doNotification(src, text, nType)
        TriggerClientEvent('QBCore:Notify', src, text, nType)
    end
end

-- Utility functions
local function GetPlayerCharName(src)
    local player = getPlayer(src)
    return player.PlayerData.charinfo.firstname..' '..player.PlayerData.charinfo.lastname
end

local function NotifyGroup(group, msg, type)
    if not group or not playerGroup[group] then return lib.print.error('Group not found...') end
    for _, v in pairs(playerGroup[group].members) do
        doNotification(v.Player, msg, type)
    end
end
exportHandler('NotifyGroup', NotifyGroup)

local function pNotifyGroup(group, header, msg)
    if not group or not playerGroup[group] then return lib.print.error('Group not found...') end
    for _, v in pairs(playerGroup[group].members) do
        TriggerClientEvent('slrn_groups:client:CustomNotification', v.Player,
            header or 'NO HEADER',
            msg or 'NO MSG'
        )
    end
end
exportHandler('pNotifyGroup', pNotifyGroup)

local function CreateBlipForGroup(groupID, name, data)
    if not groupID then return lib.print.error('CreateBlipForGroup was sent an invalid groupID :'..groupID) end

    for i=1, #playerGroup[groupID].members do
        TriggerClientEvent('groups:createBlip', playerGroup[groupID].members[i].Player, name, data)
    end
end
exportHandler('CreateBlipForGroup', CreateBlipForGroup)

local function RemoveBlipForGroup(groupID, name)
    if not groupID then return lib.print.error('CreateBlipForGroup was sent an invalid groupID :'..groupID) end

    for i=1, #playerGroup[groupID].members do
        TriggerClientEvent('groups:removeBlip', playerGroup[groupID].members[i].Player, name)
    end
end
exportHandler('RemoveBlipForGroup', RemoveBlipForGroup)


-- All group functions to get members leaders and size.
local function GetGroupByMembers(src)
    if not playerData[src] then return nil end
    for group, _ in pairs(playerGroup) do
        for _, v in pairs (playerGroup[group].members) do
            if v.Player == src then
                return group
            end
        end
    end
end
exportHandler('GetGroupByMembers', GetGroupByMembers)

local function getGroupMembers(groupID)
    if not groupID then return lib.print.error('getGroupMembers was sent an invalid groupID :'..groupID) end
    local temp = {}
    for _,v in pairs(playerGroup[groupID].members) do
        temp[#temp+1] = v.Player
    end
    return temp
end
exportHandler('getGroupMembers', getGroupMembers)

local function getGroupSize(groupID)
    if not groupID then return lib.print.error('getGroupSize was sent an invalid groupID :'..groupID) end
    if not playerGroup[groupID] then return lib.print.error('getGroupSize was sent an invalid groupID :'..groupID) end
    return #playerGroup[groupID].members
end
exportHandler('getGroupSize', getGroupSize)

local function GetGroupLeader(groupID)
    if not groupID then return lib.print.error('GetGroupLeader was sent an invalid groupID :'..groupID) end
    return playerGroup[groupID].leader
end
exportHandler('GetGroupLeader', GetGroupLeader)

local function DestroyGroup(groupID)
    if not playerGroup[groupID] then return lib.print.error('DestroyGroup was sent an invalid groupID :'..groupID) end
    local members = getGroupMembers(groupID)
    if members and #members > 0 then
        for i = 1, #members do
            if members[i] then
                playerData[members[i]] = false
            end
        end
    end

    exports['qb-phone']:resetJobStatus(groupID)
    TriggerEvent('slrn_groups:server:GroupDeleted', groupID, members)

    playerGroup[groupID] = nil
    TriggerClientEvent('slrn_groups:client:RefreshGroupsApp', -1, playerGroup)

end
exportHandler('DestroyGroup', DestroyGroup)

local function RemovePlayerFromGroup(src, groupID, disconnected)
    if not playerData[src] or not playerGroup[groupID] then return lib.print.error('RemovePlayerFromGroup was sent an invalid groupID :'..groupID) end
    local g = playerGroup[groupID].members
    for k,v in pairs(g) do
        if v.Player == src then
            table.remove(playerGroup[groupID].members, k)
            playerGroup[groupID].Users -= 1
            playerData[src] = false
            pNotifyGroup(groupID, 'Job Center', v.name..' Has left the group')
            TriggerClientEvent('slrn_groups:client:RefreshGroupsApp', -1, playerGroup)
            if not disconnected then doNotification(src, 'You have left the group', 'primary') end

            if playerGroup[groupID].Users <= 0 then
                DestroyGroup(groupID)
            end

            return
        end
    end
end

local function ChangeGroupLeader(groupID)
    local m = playerGroup[groupID].members
    local l = GetGroupLeader(groupID)
    if #m > 1 then
        for i=1, #m do
            if m[i].Player ~= l then
                playerGroup[groupID].leader = m[i].Player
                return true
            end
        end
    end
    return false
end

local function isGroupLeader(src, groupID)
    if not groupID then return end
    local grouplead = GetGroupLeader(groupID)
    return grouplead == src or false
end
exportHandler('isGroupLeader', isGroupLeader)

---- All the job functions for the groups

local function setJobStatus(groupID, status, stages)
    if not groupID then return lib.print.error('setJobStatus was sent an invalid groupID :'..groupID) end
    playerGroup[groupID].status = status
    playerGroup[groupID].stage = stages
    local m = getGroupMembers(groupID)
    if not m then return end
    for i=1, #m do
        if m[i] then
            TriggerClientEvent('slrn_groups:client:AddGroupStage', m[i], status, stages)
        end
    end
end
exportHandler('setJobStatus', setJobStatus)

local function getJobStatus(groupID)
    if not groupID then return lib.print.error('getJobStatus was sent an invalid groupID :'..groupID) end
    return playerGroup[groupID].status
end
exportHandler('getJobStatus', getJobStatus)

local function resetJobStatus(groupID)
    if not groupID then return lib.print.error('setJobStatus was sent an invalid groupID :'..groupID) end
    playerGroup[groupID].status = 'WAITING'
    playerGroup[groupID].stage = {}
    local m = getGroupMembers(groupID)
    if not m then return end
    for i=1, #m do
        if m[i] then
            TriggerClientEvent('slrn_groups:client:AddGroupStage', m[i], playerGroup[groupID].status, playerGroup[groupID].stage)
            TriggerClientEvent('slrn_groups:client:RefreshGroupsApp', m[i], playerGroup, true)
        end
    end
end
exportHandler('resetJobStatus', resetJobStatus)

AddEventHandler('playerDropped', function()
    local src = source
    local groupID = GetGroupByMembers(src)
    if groupID then
        if isGroupLeader(src, groupID) then
            if ChangeGroupLeader(groupID) then
                RemovePlayerFromGroup(src, groupID, true)
            else
                DestroyGroup(groupID)
            end
        else
            RemovePlayerFromGroup(src, groupID, true)
        end
    end
end)

RegisterNetEvent('slrn_groups:server:jobcenter_CreateJobGroup', function(data)
    local src = source
    assert(src ~= nil, 'invalid source')

    local player = getPlayer(src)
    if playerData[src] then doNotification(src, 'You have already created a group', 'error') return end
    if not data or not data.pass or not data.name then return end
    playerData[src] = true
    local ID = #playerGroup+1
    playerGroup[ID] = {
        id = ID,
        status = 'WAITING',
        GName = data.name,
        GPass = data.pass,
        Users = 1,
        leader = src,
        members = {
            {name = GetPlayerCharName(src), CID = player.PlayerData.citizenid, Player = src}
        },
        stage = {},
    }

    TriggerClientEvent('slrn_groups:client:RefreshGroupsApp', -1, playerGroup)
end)

RegisterNetEvent('TestGroups', function()
    local src = source
    local TestTable = {
        {name = 'Pick Up Truck', isDone = true, id = 1},
        {name = 'Pick up garbage', isDone = false , id = 2},
        {name = 'Drop off garbage', isDone = false , id = 3},
    }

    setJobStatus((GetGroupByMembers(src)), 'garbage', TestTable)
end)

RegisterNetEvent('slrn_groups:server:jobcenter_DeleteGroup', function(data)
    local src = source
    if not playerData[src] then return lib.print.error('You are not in a group?!?') end
    if GetGroupLeader(data.delete) == src then
        DestroyGroup(data.delete)
    else
        RemovePlayerFromGroup(src, data.delete)
    end
end)

lib.callback.register('slrn_groups:server:GetGroupsApp', function(_)
    return playerGroup
end)

RegisterNetEvent('slrn_groups:server:jobcenter_JoinTheGroup', function(data)
    local src = source
    assert(src ~= nil, 'invalid source')

    local player = getPlayer(src)
    if playerData[src] then return doNotification(src, 'You are already a part of a group!', 'success') end

    local name = GetPlayerCharName(src)
    pNotifyGroup(data.id, 'Job Center', name..' Has joined the group')
    playerGroup[data.id].members[#playerGroup[data.id].members+1] = {name = name, CID = player.PlayerData.citizenid, Player = src}
    playerGroup[data.id].Users += 1
    playerData[src] = true
    doNotification(src, 'You joined the group', 'success')
    TriggerClientEvent('slrn_groups:client:RefreshGroupsApp', -1, playerGroup)
end)

local function GetGroupStages(groupID)
    if not groupID then return lib.print.error('GetGroupStages was sent an invalid groupID :'..groupID) end
    return playerGroup[groupID].stage
end
exportHandler('GetGroupStages', GetGroupStages)

lib.callback.register('slrn_groups:server:getAllGroups', function(source)
    if playerData[source] then
        return playerGroup, true, getJobStatus(GetGroupByMembers(source)), GetGroupStages(GetGroupByMembers(source))
    else
        return playerGroup, false
    end
end)

lib.callback.register('slrn_groups:server:jobcenter_CheckPlayerNames', function(_, csn)
    local Names = {}
    for _, v in pairs(playerGroup[csn].members) do
        Names[#Names+1] = v.name
    end
    return Names
end)


RegisterNetEvent('slrn_groups:server:jobcenter_leave_grouped', function(data)
    local src = source
    if not playerData[src] then return end
    RemovePlayerFromGroup(src, data.id)
end)

local function isGroupTemp(groupID)
    if not groupID or not playerGroup[groupID] then return lib.print.error('isGroupTemp was sent an invalid groupID :'..groupID) end
    return playerGroup[groupID].ScriptCreated or false
end
exportHandler('isGroupTemp', isGroupTemp)


local function CreateGroup(src, name, password)
    if not src or not name then return end
    local Player = getPlayer(src)
    playerData[src] = true
    local id = #playerGroup+1
    playerGroup[id] = {
	    id = id,
        status = 'WAITING',
        GName = name,
        GPass = password or lib.string.random('1111111'),
        Users = 1,
        leader = src,
        members = {
            {name = GetPlayerCharName(src), CID = Player.PlayerData.citizenid, Player = src}
        },
        stage = {},
        ScriptCreated = true,
    }

    TriggerClientEvent('slrn_groups:client:RefreshGroupsApp', -1, playerGroup)
    return id
end
exportHandler('CreateGroup', CreateGroup)

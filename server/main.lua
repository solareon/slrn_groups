---@diagnostic disable: lowercase-global
if not lib then return end

lib.versionCheck('solareon/slrn_groups')

if GetCurrentResourceName() ~= 'slrn_groups' then
    lib.print.error('The resource needs to be named ^slrn_groups^7.')
    return
end

local playerData = {}
local playerGroup = {}

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


---- All the job functions for the groups

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

RegisterNetEvent('TestGroups', function()
    local src = source
    local TestTable = {
        {name = 'Pick Up Truck', isDone = true, id = 1},
        {name = 'Pick up garbage', isDone = false , id = 2},
        {name = 'Drop off garbage', isDone = false , id = 3},
    }

    setJobStatus((GetGroupByMembers(src)), 'garbage', TestTable)
end)


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
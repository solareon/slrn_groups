---@diagnostic disable: lowercase-global
if not lib then return end

lib.versionCheck('solareon/slrn_groups')

if GetCurrentResourceName() ~= 'slrn_groups' then
    lib.print.error('The resource needs to be named ^slrn_groups^7.')
    return
end

---- All the job functions for the groups

RegisterNetEvent('TestGroups', function()
    local src = source
    local TestTable = {
        {name = 'Pick Up Truck', isDone = true, id = 1},
        {name = 'Pick up garbage', isDone = false , id = 2},
        {name = 'Drop off garbage', isDone = false , id = 3},
    }

    setJobStatus((GetGroupByMembers(src)), 'garbage', TestTable)
end)
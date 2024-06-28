---@class groups : OxClass
---@field public id number
---@field public name string
---@field public leader number
---@field public ScriptCreated boolean
---@field public status string
---@field public stage {id: number, name: string, isDone: boolean}[]
---@field public members {name: string, CID: number, Player: number}[]
---@field private private {password: string}
local groups = lib.class('groups')



---Constructs a new instance of the groups class.
---@param id number
---@param name string
---@param password string?
---@param leader number
---@param ScriptCreated boolean
function groups:constructor(id, name, password, leader, ScriptCreated)
    self.id = id
    self.name = name
    self.private.password = password or lib.string.random('1111111')
    self.leader = leader
    self.ScriptCreated = ScriptCreated
    local playerData = GetPlayerData(leader)
    self.members = {
        {
            name = GetPlayerName(leader),
            CID = playerData.citizenid,
            Player = leader
        }
    }
    self.stage = {}
    self.status = 'WAITING'
end


---Adds a member to the group.
---@param source number
function groups:addMember(source)
    local playerData = GetPlayerData(source)
    self.members[#self.members+1] = {
        name = GetPlayerName(source),
        CID = playerData.citizenid,
        Player = source
    }
end


---Gets the non-sensitive data of the group.
---@return {id: number, name: string, memberCount: number}
function groups:getClientData()
    return {
        id = self.id,
        name = self.name,
        memberCount = #self.members
    }
end

---Refreshes the group stages for all members.
function groups:refreshGroupStages()
    -- #TODO: remove the need of doing this, just alert that something changed and whenever they open the app do a callback?
    for i=1, #self.members do
        if self.members[i] then
            local source = self.members[i].Player

            TriggerClientEvent('slrn_groups:client:updateGroupStage', source, self.status, self.stage)
            TriggerClientEvent('slrn_groups:client:refreshGroups', source, self:getClientData(), true)
        end
    end
end


---Gets the group member sources.
---@return number[]
function groups:getGroupMembers()
    local members = {}

    for i = 1, #self.members do
        members[i] = self.members[i].Player
    end

    return members
end

---Gets the password of a group
---@return string
function groups:getPassword()
    return self.private.password
end










return groups
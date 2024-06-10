# slrn_groups
A qb-phone compatible group app for [lb-phone](https://lbphone.com/)

**QB/QBOX supported with bridge**

## Installation
Download the [release version](https://github.com/solareon/slrn_groups/release) and copy to your server.

# Support
- [Discord](https://discord.gg/TZFBBHvG6E)

# Credits
- [RijayJH](https://github.com/RijayJH/rj_groups-for-lb_phone) for original code
- [overextended](https://github.com/overextended) for ox_lib

# Dependencies
- [ox_lib](https://github.com/overextended/ox_lib)

# Exports (server side only)

```lua
exports['qb-phone']:NotifyGroup(groupID, msg, type)

exports['qb-phone']:pNotifyGroup(groupID, header, msg)

exports['qb-phone']:CreateBlipForGroup(groupID, name, data)

exports['qb-phone']:RemoveBlipForGroup(groupID, name)

exports['qb-phone']:GetGroupByMembers(src)

exports['qb-phone']:getGroupMembers(groupID)

exports['qb-phone']:getGroupSize(groupID)

exports['qb-phone']:GetGroupLeader(groupID)

exports['qb-phone']:DestroyGroup(groupID)

exports['qb-phone']:isGroupLeader(src, groupID)

--------------------------------------------------

exports['qb-phone']:setJobStatus(groupID, status, stages)

exports['qb-phone']:getJobStatus(groupID)

exports['qb-phone']:resetJobStatus(groupID)

--------------------------------------------------

exports['qb-phone']:isGroupTemp(groupID)

exports['qb-phone']:CreateGroup(src, name, password)

```

# Copyright

Copyright © 2024 Solareon <https://github.com/solareon>

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
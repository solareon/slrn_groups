# slrn_groups
A qb-phone compatible group app for [lb-phone](https://lbphone.com/). This isn't great code but it works.

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

Both `export.slrn_groups` and `exports['qb-phone']` are supported.

```lua copy
exports.slrn_groups:NotifyGroup(groupID, msg, type)
```

```lua copy
exports.slrn_groups:pNotifyGroup(groupID, header, msg)
```

```lua copy
exports.slrn_groups:CreateBlipForGroup(groupID, name, data)
```

```lua copy
exports.slrn_groups:RemoveBlipForGroup(groupID, name)
```

```lua copy
exports.slrn_groups:GetGroupByMembers(src)
```

```lua copy
exports.slrn_groups:getGroupMembers(groupID)
```

```lua copy
exports.slrn_groups:getGroupSize(groupID)
```

```lua copy
exports.slrn_groups:GetGroupLeader(groupID)
```

```lua copy
exports.slrn_groups:DestroyGroup(groupID)
```

```lua copy
exports.slrn_groups:isGroupLeader(src, groupID)
```

```lua copy
exports.slrn_groups:setJobStatus(groupID, status, stages)
```

```lua copy
exports.slrn_groups:getJobStatus(groupID)
```

```lua copy
exports.slrn_groups:resetJobStatus(groupID)
```

```lua copy
exports.slrn_groups:isGroupTemp(groupID)
```

```lua copy
exports.slrn_groups:CreateGroup(src, name, password)
```

# Copyright

Copyright © 2024 Solareon <https://github.com/solareon>

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
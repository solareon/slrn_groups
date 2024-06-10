fx_version 'cerulean'
game 'gta5'
lua54 'yes'
use_fxv2_oal 'yes'

title 'slrn_groups'
description 'A Groups app made for LB-Phone'
author 'solareon.'
version '1.0.1'
repository 'https://github.com/solareon/slrn_groups'

client_scripts {
    'client/**/*',
    '@qbx_core/modules/playerdata.lua' -- remove if using qb-core but you really should switch to qbox
}
server_script 'server/**/*'
shared_script '@ox_lib/init.lua'

files {
    'ui/**/*'
}

ui_page 'ui/index.html'

dependency '/assetpacks'
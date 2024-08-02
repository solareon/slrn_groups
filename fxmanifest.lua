fx_version 'cerulean'
game 'gta5'
lua54 'yes'
use_fxv2_oal 'yes'

title 'slrn_groups'
description 'A Groups app made for LB-Phone'
author 'solareon.'
version '2.1.1'
repository 'https://github.com/solareon/slrn_groups'

client_scripts {
    'client/**/*',
}

server_script 'server/**/*'

shared_scripts {
    '@ox_lib/init.lua',
    'bridge/*.lua'
}


files {
    "ui/dist/**/*"
}

ui_page "ui/dist/index.html"

dependency '/assetpacks'

provide 'qb-phone'
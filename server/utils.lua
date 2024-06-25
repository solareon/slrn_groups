local utils = {}





---Notifies a player using ox_lib
---@param src number
---@param text string
---@param type string
function utils.notify(src, text, type)
    lib.notify(src, {
        description = text,
        type = type,
        duration = 5000
    }
end


---Create backwards compatability for qb-phone exports
---@param exportName string
---@param func function
function utils.exportHandler(exportName, func)
    AddEventHandler(('__cfx_export_qb-phone_%s'):format(exportName), function(setCB)
        setCB(func)
    end)

    exports(exportName, func) -- support modern exports
end







return utils
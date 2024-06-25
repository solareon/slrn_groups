local utils = {}





function utils.notify(src, text, type)
    lib.notify(src, {
        description = text,
        type = type,
        duration = 5000
    }
end


function utils.exportHandler(exportName, func)
    AddEventHandler(('__cfx_export_qb-phone_%s'):format(exportName), function(setCB)
        setCB(func)
    end)

    exports(exportName, func) -- support modern exports
end







return utils
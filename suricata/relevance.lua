filename = "/var/log/suricata/relevance.log"
file = assert(io.open(filename, "a"))
local ltn12 = require("ltn12")
local http = require("socket.http")
local json = require('cjson')


function init (args)
    local needs = {}
    needs["stream"] = tostring(true)
    return needs
end

function match(args) 
    local orders = tostring(args['stream'])

    parts = {} 
   
    ipver, srcip, dstip, proto, sp, dp = SCFlowTuple()
    local data_to_send = orders:match("PUB%s+marketorders%.ingest%s+%d+%s*\n%s*({%S*}%]})")
    
    if data_to_send == nil then
      return 0
    end

    local result, respcode, respheaders, respstatus = http.request("http://127.0.0.1:5000/predict_relevance?srcip=" .. srcip .."&orders=" .. data_to_send)

    local parsedResponse = json.decode(result)

    if result then
      -- запрос выполнился успешно
      file:write('Server response: ' .. result) -- в body тело ответа сервера
    else 
      -- произошла ошибка
      file:write('Server error ' .. respcode) -- сообщение об ошибке (например, "сервер на найден") 
    end
    
    file:write("Source IP: " .. srcip .. "\n")
    file:write("Request parts: " .. string.sub(data_to_send, 0, 70) .. " ... " .. string.sub(data_to_send, -50) .. "\n\n")
    file:flush()

    if parsedResponse['isRelevant'] == false then
      return 1
    end

    return 0
end

return 0
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


    for part in orders:gmatch("%S+") do
    -- Добавляем каждое слово в массив
      table.insert(parts, part)
    end

    local data_to_send = ''

    if parts[4] ~= nil and parts[1] == 'PUB' and parts[2] == 'marketorders.ingest' and string.sub(parts[4], -3)  == '}]}' then
      data_to_send = parts[4]
    else
      return 0
    end

    local result, respcode, respheaders, respstatus = http.request("http://127.0.0.1:5000/predict_relevance?orders=" .. data_to_send)

    local parsedResponse = json.decode(result)

    if result then
      -- запрос выполнился успешно
      file:write('Server response: ' .. result) -- в body тело ответа сервера
    else 
      -- произошла ошибка
      file:write('Server error ' .. respcode) -- сообщение об ошибке (например, "сервер на найден") 
    end
    
    file:write("Request parts: " .. parts[1] .. " " .. parts[2] .. "\n")
    file:write("Request parts: " .. string.sub(data_to_send, 0, 70) .. " ... " .. string.sub(data_to_send, -50) .. "\n\n")
    file:flush()

    if parsedResponse['isRelevant'] == false then
      return 1
    end

    return 0
end

return 0
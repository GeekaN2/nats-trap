const NATS = require('nats');
const nc = NATS.connect('nats://albiondata:albiondata@209.38.231.41:4222'); // здесь указываем адрес и порт для подключения к NATS серверу

// Пример объекта с данными
const order = { 
    "Orders": [
        { "Id": 80682351245, "ItemTypeId": "T1_HIDE", "ItemGroupTypeId": "T1_HIDE", "LocationId": 3005, "QualityLevel": 1, "EnchantmentLevel": 0, "UnitPriceSilver": 71234000000000, "Amount": 1, "AuctionType": "offer", "Expires": "2023-06-22T11:13:45.099077" },
        { "Id": 20682701856, "ItemTypeId": "T1_SWORD", "ItemGroupTypeId": "T1_HIDE", "LocationId": 3005, "QualityLevel": 1, "EnchantmentLevel": 0, "UnitPriceSilver": 7123412340000, "Amount": 3, "AuctionType": "offer", "Expires": "2023-06-22T13:12:28.209519" },
    ]};

console.log(JSON.stringify(order));

// Отправляем сообщение в топик "marketorders.ingest"
nc.publish('marketorders.ingest', JSON.stringify(order), function() {
  console.log('Сообщение отправлено в топик "marketorders.ingest"');
  nc.close();
});
const NATS = require('nats');
const nc = NATS.connect('nats://albiondata:albiondata@209.38.231.41:4222'); // здесь указываем адрес и порт для подключения к NATS серверу

// Пример объекта с данными
const order = { 
    "Orders": [
        { "Id": 80682351245, "ItemTypeId": "T2_HIDE", "ItemGroupTypeId": "T1_HIDE", "LocationId": 3005, "QualityLevel": 1, "EnchantmentLevel": 0, "UnitPriceSilver": 71230000000, "Amount": 1, "AuctionType": "offer", "Expires": "2023-06-22T11:13:45.099077" },
        { "Id": 20682701856, "ItemTypeId": "T1_SWORD", "ItemGroupTypeId": "T1_HIDE", "LocationId": 3005, "QualityLevel": 1, "EnchantmentLevel": 0, "UnitPriceSilver": 7123440000, "Amount": 3, "AuctionType": "offer", "Expires": "2023-06-22T13:12:28.209519" },
    ]};
const order2  = { 
  "Orders": [
      { "Id": 10682351244, "ItemTypeId": "T4_HIDE", "ItemGroupTypeId": "T1_HIDE", "LocationId": 3005, "QualityLevel": 1, "EnchantmentLevel": 0, "UnitPriceSilver": 70000, "Amount": 1, "AuctionType": "offer", "Expires": "2023-06-22T11:13:45.099077" },
      { "Id": 10672532012, "ItemTypeId": "T5_TRASH", "ItemGroupTypeId": "T3_TRASH", "LocationId": 3005, "QualityLevel": 1, "EnchantmentLevel": 0, "UnitPriceSilver": 113412341210000, "Amount": 4, "AuctionType": "offer", "Expires": "2023-06-20T12:43:47.108496" },
      { "Id": 10672532012, "ItemTypeId": "T3_TRASH", "ItemGroupTypeId": "T3_TRASH", "LocationId": 3005, "QualityLevel": 1, "EnchantmentLevel": 0, "UnitPriceSilver": 113412341210000, "Amount": 4, "AuctionType": "offer", "Expires": "2023-06-20T12:43:47.108496" },
      { "Id": 10672532012, "ItemTypeId": "T3_TRASH", "ItemGroupTypeId": "T3_TRASH", "LocationId": 3005, "QualityLevel": 1, "EnchantmentLevel": 0, "UnitPriceSilver": 113412341210000, "Amount": 4, "AuctionType": "offer", "Expires": "2023-06-20T12:43:47.108496" },
      { "Id": 10672532012, "ItemTypeId": "T3_TRASH", "ItemGroupTypeId": "T3_TRASH", "LocationId": 3005, "QualityLevel": 1, "EnchantmentLevel": 0, "UnitPriceSilver": 113412341210000, "Amount": 4, "AuctionType": "offer", "Expires": "2023-06-20T12:43:47.108496" },
      { "Id": 10672532012, "ItemTypeId": "T3_TRASH", "ItemGroupTypeId": "T3_TRASH", "LocationId": 3005, "QualityLevel": 1, "EnchantmentLevel": 0, "UnitPriceSilver": 113412341210000, "Amount": 4, "AuctionType": "offer", "Expires": "2023-06-20T12:43:47.108496" },
      { "Id": 10672532012, "ItemTypeId": "T3_TRASH", "ItemGroupTypeId": "T3_TRASH", "LocationId": 3005, "QualityLevel": 1, "EnchantmentLevel": 0, "UnitPriceSilver": 113412341210000, "Amount": 4, "AuctionType": "offer", "Expires": "2023-06-20T12:43:47.108496" },
      { "Id": 10672532012, "ItemTypeId": "T3_TRASH", "ItemGroupTypeId": "T3_TRASH", "LocationId": 3005, "QualityLevel": 1, "EnchantmentLevel": 0, "UnitPriceSilver": 113412341210000, "Amount": 4, "AuctionType": "offer", "Expires": "2023-06-20T12:43:47.108496" },
      { "Id": 10672532012, "ItemTypeId": "T3_TRASH", "ItemGroupTypeId": "T3_TRASH", "LocationId": 3005, "QualityLevel": 1, "EnchantmentLevel": 0, "UnitPriceSilver": 113412341210000, "Amount": 4, "AuctionType": "offer", "Expires": "2023-06-20T12:43:47.108496" },
      { "Id": 10672532012, "ItemTypeId": "T3_TRASH", "ItemGroupTypeId": "T3_TRASH", "LocationId": 3005, "QualityLevel": 1, "EnchantmentLevel": 0, "UnitPriceSilver": 113412341210000, "Amount": 4, "AuctionType": "offer", "Expires": "2023-06-20T12:43:47.108496" },
      { "Id": 10672532012, "ItemTypeId": "T3_TRASH", "ItemGroupTypeId": "T3_TRASH", "LocationId": 3005, "QualityLevel": 1, "EnchantmentLevel": 0, "UnitPriceSilver": 113412341210000, "Amount": 4, "AuctionType": "offer", "Expires": "2023-06-20T12:43:47.108496" },
      { "Id": 10672532012, "ItemTypeId": "T3_TRASH", "ItemGroupTypeId": "T3_TRASH", "LocationId": 3005, "QualityLevel": 1, "EnchantmentLevel": 0, "UnitPriceSilver": 113412341210000, "Amount": 4, "AuctionType": "offer", "Expires": "2023-06-20T12:43:47.108496" },
      { "Id": 10672532012, "ItemTypeId": "T3_TRASH", "ItemGroupTypeId": "T3_TRASH", "LocationId": 3005, "QualityLevel": 1, "EnchantmentLevel": 0, "UnitPriceSilver": 113412341210000, "Amount": 4, "AuctionType": "offer", "Expires": "2023-06-20T12:43:47.108496" },
      { "Id": 10672532012, "ItemTypeId": "T3_TRASH", "ItemGroupTypeId": "T3_TRASH", "LocationId": 3005, "QualityLevel": 1, "EnchantmentLevel": 0, "UnitPriceSilver": 113412341210000, "Amount": 4, "AuctionType": "offer", "Expires": "2023-06-20T12:43:47.108496" },
      { "Id": 10672532012, "ItemTypeId": "T3_TRASH", "ItemGroupTypeId": "T3_TRASH", "LocationId": 3005, "QualityLevel": 1, "EnchantmentLevel": 0, "UnitPriceSilver": 113412341210000, "Amount": 4, "AuctionType": "offer", "Expires": "2023-06-20T12:43:47.108496" },
      { "Id": 10672532012, "ItemTypeId": "T3_TRASH", "ItemGroupTypeId": "T3_TRASH", "LocationId": 3005, "QualityLevel": 1, "EnchantmentLevel": 0, "UnitPriceSilver": 113412341210000, "Amount": 4, "AuctionType": "offer", "Expires": "2023-06-20T12:43:47.108496" },
      { "Id": 10672532012, "ItemTypeId": "T3_TRASH", "ItemGroupTypeId": "T3_TRASH", "LocationId": 3005, "QualityLevel": 1, "EnchantmentLevel": 0, "UnitPriceSilver": 113412341210000, "Amount": 4, "AuctionType": "offer", "Expires": "2023-06-20T12:43:47.108496" },
      { "Id": 10672532012, "ItemTypeId": "T3_TRASH", "ItemGroupTypeId": "T3_TRASH", "LocationId": 3005, "QualityLevel": 1, "EnchantmentLevel": 0, "UnitPriceSilver": 113412341210000, "Amount": 4, "AuctionType": "offer", "Expires": "2023-06-20T12:43:47.108496" },
      { "Id": 10672532012, "ItemTypeId": "T3_TRASH", "ItemGroupTypeId": "T3_TRASH", "LocationId": 3005, "QualityLevel": 1, "EnchantmentLevel": 0, "UnitPriceSilver": 113412341210000, "Amount": 4, "AuctionType": "offer", "Expires": "2023-06-20T12:43:47.108496" },
      { "Id": 10672532012, "ItemTypeId": "T3_TRASH", "ItemGroupTypeId": "T3_TRASH", "LocationId": 3005, "QualityLevel": 1, "EnchantmentLevel": 0, "UnitPriceSilver": 113412341210000, "Amount": 4, "AuctionType": "offer", "Expires": "2023-06-20T12:43:47.108496" },
      { "Id": 10672532012, "ItemTypeId": "T3_TRASH", "ItemGroupTypeId": "T3_TRASH", "LocationId": 3005, "QualityLevel": 1, "EnchantmentLevel": 0, "UnitPriceSilver": 113412341210000, "Amount": 4, "AuctionType": "offer", "Expires": "2023-06-20T12:43:47.108496" },
      { "Id": 10672532012, "ItemTypeId": "T3_TRASH", "ItemGroupTypeId": "T3_TRASH", "LocationId": 3005, "QualityLevel": 1, "EnchantmentLevel": 0, "UnitPriceSilver": 113412341210000, "Amount": 4, "AuctionType": "offer", "Expires": "2023-06-20T12:43:47.108496" },
      { "Id": 10672532012, "ItemTypeId": "T3_TRASH", "ItemGroupTypeId": "T3_TRASH", "LocationId": 3005, "QualityLevel": 1, "EnchantmentLevel": 0, "UnitPriceSilver": 113412341210000, "Amount": 4, "AuctionType": "offer", "Expires": "2023-06-20T12:43:47.108496" },
  ]};

console.log(JSON.stringify(order));

// Отправляем сообщение в топик "marketorders.ingest"
nc.publish('marketorders.ingest', JSON.stringify(order2), function() {
  console.log('Сообщение отправлено в топик "marketorders.ingest"');
  nc.close();
});
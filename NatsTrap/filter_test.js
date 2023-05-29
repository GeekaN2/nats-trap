const axios = require('axios')

const test_normal = { 
    "Orders": [
        { "Id": 10682351244, "ItemTypeId": "T1_HIDE", "ItemGroupTypeId": "T1_HIDE", "LocationId": 3005, "QualityLevel": 1, "EnchantmentLevel": 0, "UnitPriceSilver": 70000, "Amount": 1, "AuctionType": "offer", "Expires": "2023-06-22T11:13:45.099077" },
        { "Id": 10672532012, "ItemTypeId": "T3_TRASH", "ItemGroupTypeId": "T3_TRASH", "LocationId": 3005, "QualityLevel": 1, "EnchantmentLevel": 0, "UnitPriceSilver": 113412341210000, "Amount": 4, "AuctionType": "offer", "Expires": "2023-06-20T12:43:47.108496" },
    ]};

async function main() {
    const response = await axios.get(`http://127.0.0.1:5000/predict_relevance?orders=${JSON.stringify(test_normal)}`);

    console.log(response.data);
}

main();
const qs = require('qs');
const axios = require('axios')

const test_normal = {
    OrderId: 12057737923,
    ItemId: 'T6_SHOES_PLATE_SET3',
    LocationId: '1002',
    QualityLevel: 1,
    UnitPriceSilver: 850000,
    Amount: 1,
    AuctionType: 'offer',
    Tier: 6,
    Subtier: 0,
}

async function main() {
    const response = await axios.get(`http://127.0.0.1:5000/predict?${qs.stringify(test_normal)}`);

    console.log(response.data);
}

main();
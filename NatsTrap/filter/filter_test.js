const qs = require('qs');
const axios = require('axios')

const test_scaled = {
    OrderId: -0.18226127,
    ItemId: 0.89023907,
    LocationId: -1.50341987,
    QualityLevel: 0.93105799,
    UnitPriceSilver: -0.05084473,
    Amount: -0.16377395,
    AuctionType: -0.50924758,
    Tier: 1.09968647,
    Subtier: 0.30587406,
}

const test_normal = {
    OrderId: 10457737923,
    ItemId: 'T6_SHOES_PLATE_SET3',
    LocationId: '1002',
    QualityLevel: 1,
    UnitPriceSilver: 8050000000,
    Amount: 1,
    AuctionType: 'offer',
    Tier: 4,
    Subtier: 2,
    Trusted: true,
}

async function main() {
    const response = await axios.get(`http://127.0.0.1:5000/predict?${qs.stringify(test_normal)}`);

    console.log(response.data);
}

main();
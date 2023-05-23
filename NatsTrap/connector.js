const NATS = require('nats');
const axios = require('axios');
const qs = require('qs');

const natsUrl = 'nats://admin:admin@localhost:4222';
// const natsUrl = 'nats://public:thenewalbiondata@albion-online-data.com:4222';
const nc = NATS.connect(natsUrl);
console.log(`Connection to NATS AOD WEST: ${natsUrl}`);

let trustedCounter = 0;
let untrustedCounter = 0;
let badRequestCounter = 0;

function getItemTier(itemId) {
    return Number(itemId.match(/T\d/g)?.[0]?.[1] ?? 1)
}

const startDate = Date.now();

setInterval(() => {
    const all = trustedCounter + untrustedCounter + badRequestCounter;
    console.log(`
${Math.floor((Date.now() - startDate) / 1000)} seconds later:
Trusted: ${trustedCounter} (${(trustedCounter / all * 100).toFixed(1)}%)
Not trusted: ${untrustedCounter} (${(untrustedCounter / all * 100).toFixed(1)}%)
Bad request: ${badRequestCounter} (${(badRequestCounter / all * 100).toFixed(1)}%)`
)}, 60_000);

async function isTrustedOrder(order) {
    const itemId = order.ItemTypeId;

    const tier = getItemTier(order.ItemTypeId)
    const preparedOrder = {
        OrderId: Number(order.Id),
        ItemId: String(itemId),
        LocationId: String(order.LocationId),
        QualityLevel: Number(order.QualityLevel),
        UnitPriceSilver: Number(order.UnitPriceSilver),
        Amount: Number(order.Amount),
        AuctionType: String(order.AuctionType),
        Tier: Number(tier),
        Subtier: Number(order.EnchantmentLevel),
    }
    try {
        const response = await axios.get(`http://127.0.0.1:5000/predict?${qs.stringify(preparedOrder)}`);

        return response.data.trusted;
    } catch (e) {
        badRequestCounter++;

        return true;
    }

}

nc.subscribe('marketorders.deduped.bulk', async function (message) {
    const orders = JSON.parse(message);

    orders.forEach(async (order) => {

        const isTrusted = await isTrustedOrder(order);
        if (isTrusted) {
            trustedCounter++;
        }
        if (!isTrusted) {
            untrustedCounter++;
        }
    })
});
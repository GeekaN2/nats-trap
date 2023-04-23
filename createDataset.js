const readline = require('readline');
const fs = require('fs');
const file = readline.createInterface({
    input: fs.createReadStream('./market_orders_dataset.json'),
    output: process.stdout,
    terminal: false
});

// Пример дампа ордера из базы данных
const example = {
    "_id": {
        "$oid": "6431a982cfa6a54f2f900d28"
    }, "OrderId": {
        "$numberDouble": "1.0457421574E+10"
    },
    "ItemId": "TREASURE_KNOWLEDGE_RARITY3",
    "LocationId": "1002",
    "QualityLevel": {
        "$numberInt": "1"
    },
    "UnitPriceSilver": {
        "$numberInt": "23741"
    }, "Amount": {
        "$numberInt": "2"
    }, "AuctionType": "offer",
    "CreatedAt": {
        "$date": {
            "$numberLong": "1680976258898"
        }
    },
    "UpdatedAt": {
        "$date": {
            "$numberLong": "1680976258898"
        }
    }, "Expires": {
        "$date": {
            "$numberLong": "1682185858898"
        }
    }
}

// id из базы данных нам не нужно, даты тоже отбросим
const exampleParsed = {
    // _id: '6431b06a0f327d52f5e4498c',
    OrderId: 10457737923,
    ItemId: 'T4_2H_CROSSBOW_CANNON_AVALON@2',
    LocationId: '1002',
    QualityLevel: 1,
    UnitPriceSilver: 17500,
    Amount: 1,
    AuctionType: 'offer',
    Tier: 4,
    Subtier: 2,
    Trusted: true,
    // CreatedAt: 1680978026615,
    // UpdatedAt: 1681347893215,
    // Expires: 1682187626615
};

const csvKeys = Object.keys(exampleParsed).join(',') + '\n';

const locationIds = new Set();
const itemIds = new Set();

function generateCrazyOrder() {
    const locations = Array.from(locationIds);
    const items = Array.from(itemIds);
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    const randomItemId = items[Math.floor(Math.random() * items.length)];

    const crazyOrder = {
        OrderId: Math.ceil(Math.random() * 1e11),
        ItemId: randomItemId,
        LocationId: String(randomLocation),
        QualityLevel: Math.ceil(Math.random() * 5),
        UnitPriceSilver: Math.ceil(Math.random() * 1e7),
        Amount: Math.ceil(Math.random() * 1000),
        AuctionType: Math.random() >= 0.5 ? 'offer' : 'request',
        Tier: Math.ceil(Math.random() * 4) + 4,
        Subtier: Math.ceil(Math.random() * 4),
        Trusted: false,
    }

    return crazyOrder;
}

fs.writeFile('./market_order.csv', csvKeys, { encoding: 'utf8' }, (error) => {
    if (error) {
        console.error(error);
        return;
    }
});

let lineCounter = 0;

file.on('line', (line) => {
    const parsed = JSON.parse(line);
    const tier = parsed.ItemId.match(/T\d/g)?.[0]?.[1] ?? 1;
    const subtier = parsed.ItemId.match(/@\d/g)?.[0]?.[1] ?? 0;
    const csvReady = {
        // _id: parsed._id.$oid,
        OrderId: Number(parsed.OrderId.$numberDouble),
        ItemId: parsed.ItemId,
        LocationId: String(parsed.LocationId),
        QualityLevel: Number(parsed.QualityLevel.$numberInt),
        UnitPriceSilver: Number(parsed.UnitPriceSilver.$numberInt),
        Amount: Number(parsed.Amount.$numberInt),
        AuctionType: parsed.AuctionType,
        Tier: tier,
        Subtier: subtier,
        // CreatedAt: Number(parsed.CreatedAt.$date.$numberLong),
        // UpdatedAt: Number(parsed.UpdatedAt.$date.$numberLong),
        // Expires: Number(parsed.Expires.$date.$numberLong),
        Trusted: true,
    };

    locationIds.add(parsed.LocationId);
    itemIds.add(parsed.ItemId);

    const values = Object.values(csvReady).join(',') + "\n";

    fs.writeFile('./market_order.csv', values, { encoding: 'utf8', flag: 'a+' }, (error) => {
        if (error) {
            console.error(error);
            return;
        }
    });

    lineCounter++;
    
    if (lineCounter % 1e5 === 0) {
        console.log(`write ${lineCounter} trusted lines`);
    }
});


file.on('close', () => {
    for (let counter = 0; counter < 1e6; counter++) {
        const crazyOrder = generateCrazyOrder();
        const values = Object.values(crazyOrder).join(',') + "\n";

        fs.writeFile('./market_order.csv', values, { encoding: 'utf8', flag: 'a+' }, (error) => {
            if (error) {
                console.error(error);
                return;
            }
        });

        if (counter % 1e5 === 0) {
            console.log(`write ${counter} untrusted lines`);
        }
    }
});

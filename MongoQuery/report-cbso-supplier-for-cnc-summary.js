db.getCollection("staging").aggregate([
    {
        "$match": {
            "processing": 1,
            "orderType": "CNC",
            "primarySupplier": "1133",
            "cbState":"VIC"
        }
    },
    {
        "$project": {
            "_id": 0,
            "vpn": 1,
            "skuDesc": 1,
            "qtyOrdered": 1,
            "uom": 1,
            "orderBTax": 1, 
            "extendedValue": 1
        }
    },
    {
        "$group": {
            "_id": "$vpn",
            "vpn": {
                "$first": "$vpn"
            },
            "productDesc": {
                "$first": "$skuDesc"
            },
            "qty": {
                "$sum": "$qtyOrdered"
            },
            "uom": {
                "$first": "$uom"
            },
            "unitCostExcGST": {
                "$first": "$orderBTax"
            },
            "totalValueExcGST": {
                "$sum": {
                    "$multiply": ["$orderBTax", "$qtyOrdered"]
                }
            },
            "extendedValue": {
                "$sum": "$extendedValue"
            }
        }
    },
    {
        "$project": {
            "_id": 0,
            "vpn": 1,
            "totalValueExcGST": {
                "$trunc":["$totalValueExcGST", 2]
            },
            "productDesc": 1,
            "qty": 1,
            "uom": 1,
            "unitCostExcGST": 1,
            "extendedValue": {
                "$trunc": ["$extendedValue", 2]
            }
        }
    }
])
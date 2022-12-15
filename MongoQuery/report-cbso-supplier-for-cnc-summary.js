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
            "totalValueIncl": {
                "$sum": "$extendedValue"
            }
        }
    },
    {
        "$project": {
            "_id": 0,
            "vpn": 1,
            "productDesc": 1,
            "qty": 1,
            "totalValueExcGST": {
                "$trunc":["$totalValueExcGST", 2]
            },
            "uom": 1,
            "unitCostExcGST": 1,
            "totalValueIncl": {
                "$trunc": ["$totalValueIncl", 2]
            }
        }
    },
    {
        "$facet": {
            "total": [
                {
                    "$group": {
                        "_id": "Total",
                        "vpn": {"$sum": ""},
                        "productDesc": {"$sum": ""},
                        "totalQty": {"$sum": "$$ROOT.qty"},
                        "uom": {"$sum": ""},
                        "unitCostExcGST": {"$sum": ""},
                        "totalValueExcGST": {"$sum": "$$ROOT.totalValueExcGST"},
                        "totalValueIncl": {"$sum": "$$ROOT.totalValueIncl"}
                    }
                }
            ],
            "data": [{ "$match": {} }]
        }
    },
    { 
        "$project": {
            "data": {
              "$concatArrays": ["$data", "$total"]
            }
         }
    }
])
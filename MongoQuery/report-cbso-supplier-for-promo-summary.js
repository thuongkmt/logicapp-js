db.getCollection("staging").aggregate([
    {
        "$match": {
            "eventCode": "2608413",
            "processing": 1,
            "orderType": "Promo",
            "primarySupplier": "2019",
            "cbState": "NSW"
        }
    },
    {
        "$addFields": {
            "consolidationDateString": {
                "$substr": [ "$consolidationDate", 0, 10 ]
            }
        }
    },
    {
        "$match":{
            "$and": [
                {"consolidationDateString": {"$eq": "2022-12-28"}}, 
            ]
        }
    },
    {
        "$group": {
            "_id": "$itemCode",
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
        "$sort": {
            "vpn": 1
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
                        "totalQty": {"$sum": "$qty"},
                        "uom": {"$sum": ""},
                        "unitCostExcGST": {"$sum": ""},
                        "totalValueExcGST": {"$sum": "$totalValueExcGST"},
                        "totalValueIncl": {"$sum": "$totalValueIncl"}
                    }
                }
            ],
            "data": [{ "$match": {} }]
        }
    },
    { 
        "$project": {
            "summary": {
              "$concatArrays": ["$data", "$total"]
            }
         }
    }
])
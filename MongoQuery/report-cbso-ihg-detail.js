db.getCollection("staging").aggregate([
    {
        "$match":{
            "orderType": "Promo",
            "docNo": {
                "$in": [10000007, 10000008, 10000012]
            }
        }
    },
    {
        "$addFields": {
            "totalLine": {
               "$sum": {
                    "$multiply": ["$orderBTax", "$qtyOrdered"]
                }
            },
            "unitCost": "$orderBTax"
        }
    },
    {
        "$group":{
            "_id": {
                "primarySupplier": "$primarySupplier",
                "storeNumber": "$storeNumber"
            },
            "stores": {
                "$push": "$$ROOT"
            },
            "supplierStoreTotal": {
                "$sum": {
                    "$multiply": "$totalLine"
                }
            }
        }
    }
])

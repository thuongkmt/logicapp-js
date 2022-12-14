db.getCollection("staging").aggregate([
    {
        "$match": {
            "processing": 0,
            "orderType": "Promo"
        }
    },
    {
        "$group": {
            "_id": {
                "eventCode": "$eventCode",
                "primarySupplier": "$primarySupplier",
                "cbState": "$cbState",
                "storeNumber": "$storeNumber",
                "poNumber": "$poNumber"
            },
            "stores": {
                "$push": "$$ROOT"
            }
        }
    }
])

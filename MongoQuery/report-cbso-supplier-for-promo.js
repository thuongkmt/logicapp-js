db.getCollection("staging").aggregate([
    {
        "$match": {
            "processing": 2,
            "orderType": "Promo"
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
                {"consolidationDateString": {"$eq": "2022-12-29"}}, 
            ]
        }
    },
    {
        "$addFields": {
            "totalValueExcGSTRaw": {
                "$multiply":["$orderBTax", "$qtyOrdered"]
            }
        }
    },
    {
        "$addFields": {
            "totalValueExcGST": {
                "$trunc":["$totalValueExcGSTRaw", 2]
            }
        }
    }, 
    {
        "$sort": {
            "productSEQ": 1
        }
    },
    {
        "$group": {
            "_id": {
                "consolidationDateString": "$consolidationDateString",
                "eventCode": "$eventCode",
                "orderType": "$orderType",
                "primarySupplier": "$primarySupplier",
                "cbState": "$cbState",
                "storeNumber": "$storeNumber",
                "poNumber": "$poNumber"
            },
            "storeNumberGroups": {
                "$push": "$$ROOT"
            }
        }
    },
    {
        "$group": {
            "_id": {
                "consolidationDateString": "$_id.consolidationDateString",
                "eventCode": "$_id.eventCode",
                "orderType": "$_id.orderType",
                "primarySupplier": "$_id.primarySupplier",
                "cbState": "$_id.cbState",
                "storeNumber": "$_id.storeNumber"
            },
            "poNumberGroups":{
                "$addToSet": {
                    "poNumber": "$_id.poNumber",
                    "poNumberGroups": "$storeNumberGroups"
                }
            }
        }
    },
    {
        "$group":{
            "_id": {
                "consolidationDateString": "$_id.consolidationDateString",
                "eventCode": "$_id.eventCode",
                "orderType": "$_id.orderType",
                "primarySupplier": "$_id.primarySupplier",
                "cbState": "$_id.cbState"
            },
            "stores":{
                "$addToSet": {
                    "storeNumber": "$_id.storeNumber",
                    "storeNumberGroups": "$poNumberGroups"
                }
            }
        }
    },
    {
        "$project":{
            "stores.storeNumberGroups.poNumberGroups.orderCreated": 0,
            "stores.storeNumberGroups.poNumberGroups.itemCode": 0,
            "stores.storeNumberGroups.poNumberGroups.inserted": 0,
            "stores.storeNumberGroups.poNumberGroups.storePCode": 0,
            "stores.storeNumberGroups.poNumberGroups.storeBrand": 0,
            "stores.storeNumberGroups.poNumberGroups.cbState": 0,
            "stores.storeNumberGroups.poNumberGroups.skuCategory": 0,
            "stores.storeNumberGroups.poNumberGroups.suppMinOrd": 0    
        }
    }
])

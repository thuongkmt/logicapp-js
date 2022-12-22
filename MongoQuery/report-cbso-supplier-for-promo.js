db.getCollection("staging").aggregate([
    {
        "$match": {
            "processing": 0,
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
                {"consolidationDateString": {"$eq": "2022-12-22"}}, 
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
            "stores": {
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
            "storeNumberGroups":{
                "$addToSet": {
                    "poNumber": "$_id.poNumber",
                    "storeNumberGroup": "$stores"
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
            "data":{
                "$addToSet": {
                    "storeNumber": "$_id.storeNumber",
                    "stores": "$storeNumberGroups"
                }
            }
        }
    },
    {
        "$project":{
            "data.stores.storeNumberGroup.orderCreated": 0,
            "data.stores.storeNumberGroup.productSEQ": 0,
            "data.stores.storeNumberGroup.itemCode": 0,
            "data.stores.storeNumberGroup.orderCreated": 0,
            "data.stores.storeNumberGroup.inserted": 0,
            "data.stores.storeNumberGroup.storePCode": 0,
            "data.stores.storeNumberGroup.storeBrand": 0,
            "data.stores.storeNumberGroup.cbState": 0,
            "data.stores.storeNumberGroup.skuCategory": 0,
            "data.stores.storeNumberGroup.suppMinOrd": 0    
        }
    }
])

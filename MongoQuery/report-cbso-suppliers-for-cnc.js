db.getCollection("staging").aggregate([
    {
        "$match": {
            "processing": 1,
            "orderType": "CNC"
        }
    },
    {
        "$addFields": {
            "totalValueExcGST": {
                "$multiply":["$orderBTax", "$qtyOrdered"]
            }
        }
    },
    {
        "$group": {
            "_id": {
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
            "stores.storeNumberGroups.poNumberGroups.productSEQ": 0,
            "stores.storeNumberGroups.poNumberGroups.itemCode": 0,
            "stores.storeNumberGroups.poNumberGroups.orderCreated": 0,
            "stores.storeNumberGroups.poNumberGroups.inserted": 0,
            "stores.storeNumberGroups.poNumberGroups.storePCode": 0,
            "stores.storeNumberGroups.poNumberGroups.storeBrand": 0,
            "stores.storeNumberGroups.poNumberGroups.cbState": 0,
            "stores.storeNumberGroups.poNumberGroups.skuCategory": 0,
            "stores.storeNumberGroups.poNumberGroups.consolidationDate": 0,
            "stores.storeNumberGroups.poNumberGroups.suppMinOrd": 0        
        }
    }
])
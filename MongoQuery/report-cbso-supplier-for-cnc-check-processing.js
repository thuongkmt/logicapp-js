db.getCollection("staging").aggregate([
    {
        "$match": {
            "processing": 0,
            "orderType": "CNC"
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
            "stores.storeNumberGroups.poNumberGroups._id": 1,
            "stores.storeNumberGroups.poNumberGroups.poNumber": 1,
            "stores.storeNumberGroups.poNumberGroups.orderType": 1,
            "stores.storeNumberGroups.poNumberGroups.storeNumber": 1,
            "stores.storeNumberGroups.poNumberGroups.processing": 1,
            "stores.storeNumberGroups.poNumberGroups.orderType": 1,
            "stores.storeNumberGroups.poNumberGroups.docNo": 1     
        }
    }
])
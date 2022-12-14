db.getCollection("staging").aggregate([
    {
        "$match": {
            "processing": 0,
            "orderType": "CNC"
        }
    },
    {
        "$group": {
            "_id": {
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
            "data.stores.storeNumberGroup._id": 0,
            "data.stores.storeNumberGroup.orderCreated": 0,
            "data.stores.storeNumberGroup.productSEQ": 0,
            "data.stores.storeNumberGroup.itemCode": 0,
            "data.stores.storeNumberGroup.orderCreated": 0,
            "data.stores.storeNumberGroup.inserted": 0,
            "data.stores.storeNumberGroup.processing": 0,
            "data.stores.storeNumberGroup.storePCode": 0,
            "data.stores.storeNumberGroup.storeBrand": 0,
            "data.stores.storeNumberGroup.cbState": 0,
            "data.stores.storeNumberGroup.skuCategory": 0,
            "data.stores.storeNumberGroup.consolidationDate": 0,
            "data.stores.storeNumberGroup.suppMinOrd": 0        
        }
    }
])
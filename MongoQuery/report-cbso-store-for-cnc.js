db.getCollection("staging").aggregate([
    {
        "$match": {
            "orderType": "CNC",
            "docNo": {
                "$in": [10000007, 10000008]
            }
        }
    },
    {
        "$group": {
            "_id": {
                "orderType": "$orderType",
                "storeNumber": "$storeNumber",
                "primarySupplier": "$primarySupplier",
                "cbState": "$cbState",
                "poNumber": "$poNumber"
            },
            "primarySuppliers": {
                "$push": "$$ROOT"
            }
        }
    },
    {
        "$group": {
             "_id": {
                "orderType": "$_id.orderType",
                "storeNumber": "$_id.storeNumber",
                "cbState": "$_id.cbState",
                "primarySupplier": "$_id.primarySupplier"
            },
            "poNumberGroups": {
                "$addToSet": {
                    "poNumber": "$_id.poNumber",
                    "poNumberGroups": "$primarySuppliers"
                }
            }
        }
    },
    {
        "$group": {
            "_id": {
                "orderType": "$_id.orderType",
                "storeNumber": "$_id.storeNumber",
                "cbState": "$_id.cbState",
                
            },
            "primarySupplierGroups": {
                "$addToSet": {
                    "primarySupplier": "$_id.primarySupplier",
                    "primarySupplierGroups": "$poNumberGroups"
                }
            }
        }
    }
])

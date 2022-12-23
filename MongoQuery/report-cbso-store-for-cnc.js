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
                "cbState": "$cbState",
                "storeNumber": "$storeNumber",
                "primarySupplier": "$primarySupplier",
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
                "cbState": "$_id.cbState",
                "storeNumber": "$_id.storeNumber",
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
                "cbState": "$_id.cbState",
                "storeNumber": "$_id.storeNumber"
            },
            "primarySupplierGroups": {
                "$addToSet": {
                    "primarySupplier": "$_id.primarySupplier",
                    "primarySupplierGroups": "$poNumberGroups"
                }
            }
        }
    },
    {
        "$project": {
            "primarySupplierGroups.primarySupplierGroups.poNumberGroups.orderCreated": 0,
            "primarySupplierGroups.primarySupplierGroups.poNumberGroups.extendedValue": 0,
            "primarySupplierGroups.primarySupplierGroups.poNumberGroups.uom": 0,
            "primarySupplierGroups.primarySupplierGroups.poNumberGroups.inserted": 0,
            "primarySupplierGroups.primarySupplierGroups.poNumberGroups.storeAdd1": 0,
            "primarySupplierGroups.primarySupplierGroups.poNumberGroups.storeAdd2": 0,
            "primarySupplierGroups.primarySupplierGroups.poNumberGroups.storeCity": 0,
            "primarySupplierGroups.primarySupplierGroups.poNumberGroups.state": 0,
            "primarySupplierGroups.primarySupplierGroups.poNumberGroups.storePCode": 0,
            "primarySupplierGroups.primarySupplierGroups.poNumberGroups.storeBrand": 0,
            "primarySupplierGroups.primarySupplierGroups.poNumberGroups.cbState": 0,
            "primarySupplierGroups.primarySupplierGroups.poNumberGroups.contactName": 0,
            "primarySupplierGroups.primarySupplierGroups.poNumberGroups.contactEmail": 0,
            "primarySupplierGroups.primarySupplierGroups.poNumberGroups.skuCategory": 0,
            "primarySupplierGroups.primarySupplierGroups.poNumberGroups.consolidationDate": 0,
            "primarySupplierGroups.primarySupplierGroups.poNumberGroups.suppMinOrd": 0
        }
    }
])

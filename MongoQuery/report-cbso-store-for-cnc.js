db.getCollection("staging").aggregate([
    {
        "$match": {
            "orderType": "Promo",
            "docNo": {
                "$in": [10000418]
            }
        }
    },
    {
        "$addFields": {
            "processedDateFormat": {
                "$dateFromString": {"dateString": "$processedDate", "format": "%Y-%m-%dT%H:%M:%S.%LZ"}
            }
        }
    },
    {
        "$set": {
            "processedDate" : {
                "$dateToString": {"date": "$processedDateFormat", "format": "%Y-%m-%d", "timezone":"Australia/Melbourne"}
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
        "$sort": {
            "_id.primarySupplier": 1,
            "_id.poNumber": 1,
            "primarySuppliers.productSEQ": 1
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

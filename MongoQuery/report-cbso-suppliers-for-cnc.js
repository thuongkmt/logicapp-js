db.getCollection("staging").aggregate([
    {
        "$match": {
            "processing": 1,
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
            "stores.storeNumberGroups.poNumberGroups.poNumber": 1,
            "stores.storeNumberGroups.poNumberGroups.orderType": 1,
            "stores.storeNumberGroups.poNumberGroups.storeNumber": 1,
            "stores.storeNumberGroups.poNumberGroups.promId": 1,
            "stores.storeNumberGroups.poNumberGroups.upc": 1,
            "stores.storeNumberGroups.poNumberGroups.skuDesc": 1,
            "stores.storeNumberGroups.poNumberGroups.orderBTax": 1,
            "stores.storeNumberGroups.poNumberGroups.extendedValue": 1,
            "stores.storeNumberGroups.poNumberGroups.qtyOrdered": 1,
            "stores.storeNumberGroups.poNumberGroups.uom": 1,
            "stores.storeNumberGroups.poNumberGroups.processing": 1,    
            "stores.storeNumberGroups.poNumberGroups.storeName": 1,
            "stores.storeNumberGroups.poNumberGroups.storeAdd1": 1,
            "stores.storeNumberGroups.poNumberGroups.storeAdd2": 1,
            "stores.storeNumberGroups.poNumberGroups.storeCity": 1,
            "stores.storeNumberGroups.poNumberGroups.state": 1,
            "stores.storeNumberGroups.poNumberGroups.primarySupplier": 1,
            "stores.storeNumberGroups.poNumberGroups.supName": 1,
            "stores.storeNumberGroups.poNumberGroups.contactName": 1,
            "stores.storeNumberGroups.poNumberGroups.contactPhone": 1,
            "stores.storeNumberGroups.poNumberGroups.contactEmail": 1,
            "stores.storeNumberGroups.poNumberGroups.vpn": 1,
            "stores.storeNumberGroups.poNumberGroups.eventCode": 1,
            "stores.storeNumberGroups.poNumberGroups.eventDesc": 1,
            "stores.storeNumberGroups.poNumberGroups.notBeforeDate": 1,
            "stores.storeNumberGroups.poNumberGroups.notAfterDate": 1,
            "stores.storeNumberGroups.poNumberGroups.totalValueExcGST": 1
        }
    }
])
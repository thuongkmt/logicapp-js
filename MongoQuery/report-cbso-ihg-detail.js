db.getCollection("staging").aggregate([
    {
        "$match":{
            "orderType": "CNC",
            "docNo": {
                "$in": [10000007, 10000008, 10000009]
            }
        }
    },
    {
        "$addFields": {
            "totalLine": {
               "$sum": {
                    "$multiply": ["$orderBTax", "$qtyOrdered"]
                }
            }
        }
    },
    {
        "$sort": {
            "eventCode": 1,
            "primarySupplier": 1,
            "storeNumber": 1,
            "poNumber": 1,
            "skuCategory": 1,
            "productSEQ": 1
        }
    },
    {
        "$project": {
            "eventCode": 1,
            "eventDescription": "$eventDesc",
            "documentNumber": "$docNo",
            "supplierNumber": "$primarySupplier",
            "supplierName": "$supName",
            "contact": "$contactName",
            "phone": "$contactPhone",
            "emailAddress": {
                "$cond": {
                    "if": {
                        "$eq": ["$processing", 3]
                    },
                    "then": "Fail to send to supplier",
                    "else": "$contactEmail"
                }
            },
            "emailSent": "$processedDate",
            "stockDeliveryFrom": "$notBeforeDate",
            "stockDeliveryTo": "$notAfterDate",
            "item": "$itemCode",
            "vpn": 1,
            "apn": "$upc",
            "description": "$skuDesc",
            "category": "$skuCategory",
            "store": "$storeNumber",
            "storeName": 1,
            "storeBrand": 1,
            "storeRef": "$poNumber",
            "orderCreatedDate": "$orderCreated",
            "quantityOrdered": "$qtyOrdered",
            "uom" : 1,
            "unitCost": "$orderBTax",
            "totalLine": {
                "$trunc": ["$totalLine", 2]
            },
            "supplierMin": {"$concat": [{"$literal": "$"}, {"$toString": "$suppMinOrd"}]}
        }
    },
    {
        "$group":{
            "_id": {
                "supplierNumber": "$supplierNumber",
                "store": "$store"
            },
            "stores": {
                "$push": "$$ROOT"
            },
            "supplierStoreTotal": {
                "$sum": "$totalLine"
            }
        }
    },
    {
        "$project":{
            "_id": 1,
            "stores": 1,
            "supplierStoreTotal": {
                "$trunc": ["$supplierStoreTotal", 2]
            }
        }
    }
])

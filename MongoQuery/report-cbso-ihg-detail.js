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
    },
    {
        "$unwind": "$stores"
    },
    {
        "$project": {
            "_id": 0,
            "eventCode": "$stores.eventCode",
            "eventDescription": "$stores.eventDescription",
            "documentNumber": "$stores.documentNumber",
            "supplierNumber": "$stores.supplierNumber",
            "contact": "$stores.contact",
            "phone": "$stores.phone",
            "emailAddress": "$stores.emailAddress",
            "emailSent": "$stores.emailSent",
            "stockDeliveryFrom": "$stores.stockDeliveryFrom",
            "stockDeliveryTo": "$stores.stockDeliveryTo",
            "item": "$stores.item",
            "vpn": "$stores.vpn",
            "apn": "$stores.apn",
            "description": "$stores.description",
            "category": "$stores.category",
            "store": "$_id.store",
            "storeName": "$_id.storeName",
            "storeBrand": "$_id.storeBrand",
            "storeRef": "$stores.storeRef",
            "orderCreatedDate": "$stores.orderCreatedDate",
            "quantityOrdered": "$stores.quantityOrdered",
            "uom": "$store.uom",
            "unitCost": "$stores.unitCost",
            "lineTotal": "$stores.totalLine",
            "supplierStoreTotal": "$supplierStoreTotal",
            "supplierMin": "$stores.supplierMin"
            
        }
    }
])
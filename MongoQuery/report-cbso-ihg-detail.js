db.getCollection("staging").aggregate([
    {
        "$match":{
            "orderType": "CNC",
            "docNo": {
                "$in": [10000430]
            }
        }
    },
    {
        "$addFields": {
            "totalLine": {
               "$sum": {
                    "$multiply": ["$orderBTax", "$qtyOrdered"]
                }
            },
            "orderCreatedFormat": {
                "$dateFromString": {"dateString": "$orderCreated"}
            },
            "processedDateFormat": {
                "$dateFromString": {"dateString": "$processedDate", "format": "%Y-%m-%dT%H:%M:%S.%LZ"}
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
            "eventCode": "$eventCode",
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
            "emailSentFormat": "$processedDateFormat",
            "stockDeliveryFrom": "$notBeforeDate",
            "stockDeliveryTo": "$notAfterDate",
            "item": "$itemCode",
            "vpn": "$vpn",
            "apn": "$upc",
            "description": "$skuDesc",
            "category": "$skuCategory",
            "store": "$storeNumber",
            "storeName": "$storeName",
            "storeBrand": "$storeBrand",
            "storeRef": "$poNumber",
            "orderCreatedDate": "$orderCreated",
            "orderCreatedFormat": "$orderCreatedFormat",
            "quantityOrdered": "$qtyOrdered",
            "uom" : "$uom",
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
            "emailSentMel": {
                "$dateToString": {"date": "$stores.emailSentFormat", "format": "%Y-%m-%d", "timezone":"Australia/Melbourne"}
            },
            "stockDeliveryFrom": "$stores.stockDeliveryFrom",
            "stockDeliveryTo": "$stores.stockDeliveryTo",
            "item": "$stores.item",
            "vpn": "$stores.vpn",
            "apn": "$stores.apn",
            "description": "$stores.description",
            "category": "$stores.category",
            "store": "$_id.store",
            "storeName": "$stores.storeName",
            "storeBrand": "$stores.storeBrand",
            "storeRef": "$stores.storeRef",
            "orderCreatedDate": "$stores.orderCreatedDate",
            "orderCreatedDateMel": {
                "$dateToString": {"date": "$stores.orderCreatedFormat", "format": "%Y-%m-%d", "timezone":"Australia/Melbourne"}
            },
            "quantityOrdered": "$stores.quantityOrdered",
            "uom": "$store.uom",
            "unitCost": "$stores.unitCost",
            "lineTotal": "$stores.totalLine",
            "supplierStoreTotal": "$supplierStoreTotal",
            "supplierMin": "$stores.supplierMin"
        }
    }
])

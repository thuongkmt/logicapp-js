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
            "Event Code": "$stores.eventCode",
            "Event Description": "$stores.eventDescription",
            "Document Number": "$stores.documentNumber",
            "Supplier Number": "$stores.supplierNumber",
            "Contact": "$stores.contact",
            "Phone": "$stores.phone",
            "Email Address": "$stores.emailAddress",
            "Email Sent": "$stores.emailSent",
            "Stock Delivery From": "$stores.stockDeliveryFrom",
            "Stock Delivery To": "$stores.stockDeliveryTo",
            "Item": "$stores.item",
            "VPN": "$stores.vpn",
            "APN": "$stores.apn",
            "Description": "$stores.description",
            "Category": "$stores.category",
            "Store": "$_id.store",
            "Store Name": "$_id.storeName",
            "Store Brand": "$_id.storeBrand",
            "Store Ref": "$stores.storeRef",
            "Order Created Date": "$stores.orderCreatedDate",
            "Quantity Ordered": "$stores.quantityOrdered",
            "UOM": "$store.uom",
            "Unit Cost": "$stores.unitCost",
            "Line Total": "$stores.totalLine",
            "Supplier Store Total": "$supplierStoreTotal",
            "Supplier Min": "$stores.supplierMin"
            
        }
    }
])

db.getCollection("staging").aggregate([
        {
            "$match": {
                "orderType": "CNC",
                "docNo": {
                    "$in": [10000007, 10000008, 10000009]
                }
            }
        },
        {
            "$group":{
                "_id": {
                    "docNo": "$docNo"
                },
                "eventCode": { "$first": "$eventCode" },
                "eventDesc": { "$first": "$eventDesc" },
                "documentNumber": { "$first": "$docNo" },
                "supplierNumber": { "$first": "$primarySupplier" },
                "supplierName": { "$first": "$supName" },
                "contact": { "$first": "$contactName" },
                "phone": { "$first": "$contactPhone" },
                "emailAddress": { "$first": "$contactEmail" },
                "emailSent": { "$first": "$processDate" },
                "stockDeliveryFrom": { "$first": "$notBeforeDate" },
                "stockDeliveryTo": { "$first": "$notAfterDate" },
                "processing": { "$first": "$processing" }
            }
        },
        {
            "$sort": {
                "_id.docNo": 1
            }
        },
        {
            "$project": {
                "_id": 0,
                "Event Code": "$eventCode",
                "Event Desciption": "$eventDesc",
                "Document Number": "$documentNumber",
                "Supplier Number": "$supplierNumber",
                "Supplier Name": "$supplierName",
                "Contact": "$contact",
                "Phone": "$phone",
                "Email Address": {
                    "$cond": {
                        "if": {
                            "$eq": ["$processing", 3]
                        },
                        "then": "Fail to send to supplier",
                        "else": "$emailAddress"
                    }
                },
                "Email Sent": "$emailSent",
                "Stock Delivery From": "$stockDeliveryFrom",
                "Stock Delivery To": "$stockDeliveryFrom"
            }
        }
  ])

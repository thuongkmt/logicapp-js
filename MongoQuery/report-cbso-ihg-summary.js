db.getCollection("staging").aggregate([
        {
            "$match": {
                "orderType": "CNC",
                "docNo": {
                    "$in": [10000142, 10000141, 10000140]
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
                "eventCode": "$eventCode",
                "eventDescription": "$eventDesc",
                "documentNumber": "$documentNumber",
                "supplierNumber": "$supplierNumber",
                "supplierName": "$supplierName",
                "contact": "$contact",
                "phone": "$phone",
                "emailAddress": {
                    "$cond": {
                        "if": {
                            "$eq": ["$processing", 3]
                        },
                        "then": "Fail to send to supplier",
                        "else": "$emailAddress"
                    }
                },
                "emailSent": "$emailSent",
                "stockDeliveryFrom": "$stockDeliveryFrom",
                "stockDeliveryTo": "$stockDeliveryFrom"
            }
        }
  ])

db.getCollection("staging").aggregate([
    {
        "$match": {
            "orderType": "CNC",
            "docNo":{
                "$in": [10000007, 10000008, 10000012]
            }
        }
    },
    {
        "$group":{
            "_id": {
                "docNo": "$docNo"
            },
            "eventCode": { '$first': '$eventCode' },
            "eventDesc": { '$first': '$eventDesc' },
            "documentNumber": { '$first': '$docNo' },
            "supplierNumber": { '$first': '$primarySupplier' },
            "supplierName": { '$first': '$supName' },
            "supplierName": { '$first': '$supName' },
            "contact": { '$first': '$contactName' },
            "phone": { '$first': '$contactPhone' },
            "emailAddress": { '$first': '$contactEmail' },
            "emailSent": { '$first': '$processDate' },
            "stockDeliveryFrom": { '$first': '$notBeforeDate' },
            "stockDeliveryTo": { '$first': '$notAfterDate' },
            "processing": { '$first': '$processing' },
        }
    },
    {
        "$project": {
            "eventCode": 1,
            "eventDesc": 1,
            "documentNumber": 1,
            "supplierNumber": 1,
            "supplierName": 1,
            "supplierName": 1,
            "contact": 1,
            "phone": 1,
            "emailAddress": {
                "$cond": {
                    "if": {
                        "$eq": ["$processing", 3]
                    },
                    "then": "Fail to send to supplier",
                    "else": "$emailAddress"
                }
            },
            "emailSent": 1,
            "stockDeliveryFrom": 1,
            "stockDeliveryTo": 1,
        }
    },
    {
        "$sort": {
            "documentNumber": 1
        }
    }
])

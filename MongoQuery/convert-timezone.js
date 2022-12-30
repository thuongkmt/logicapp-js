db.getCollection("staging").aggregate([
    {
        "$match": {
            "processing": 0,
            "orderType": "Promo",
            "consolidationDate" : "2022-12-15T15:00:00.000Z"
        }
    },
    {
        "$addFields":{
            "orderCreatedFormat": {
                "$dateFromString": {"dateString": "$orderCreated"}
            },
            "insertedFormat": {
                "$dateFromString": {"dateString": "$inserted", format: "%Y-%m-%dT%H:%M:%S.%LZ"}
            },
            "consolidationDateFormat": {
                "$dateFromString": {"dateString": "$consolidationDate", format: "%Y-%m-%dT%H:%M:%S.%LZ"}
            }
        }
    },
    {
        "$project":{
            "orderCreated": "$orderCreated",
            "orderCreatedMel": {
                "$dateToString": {"date": "$orderCreatedFormat", format: "%Y-%m-%dT%H:%M:%S.%LZ", "timezone":"Australia/Melbourne"}
            },
            "inserted": "$inserted",
            "insertedMel": {
                "$dateToString": {"date": "$insertedFormat", format: "%Y-%m-%dT%H:%M:%S.%LZ", "timezone":"Australia/Melbourne"}
            },
            "consolidationDate": "$consolidationDate",
            "consolidationDateMel": {
                "$dateToString": {"date": "$consolidationDateFormat", format: "%Y-%m-%dT%H:%M:%S.%LZ", "timezone":"Australia/Melbourne"}
            }
        }
    }
    
])

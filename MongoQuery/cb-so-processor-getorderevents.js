db.getCollection("orderevents").aggregate([
    {
        "$match": {
            "targetBackend": "AX",
            "event.eventPromChannelStores.promCode": {
                "$in": [22151900, "22312900"]
            },
        }
    },
    {
        "$project": {
            "_id": 0,
            "event.eventPromChannelStores.promCode": 1,
            "event.eventCode": 1,
            "event.eventDescription": 1,
            "event.agencyDeliveryStartDate": 1,
            "event.agencyDeliveryEndDate": 1,
            "event.consolidationDate": 1
        }
    },
    {
        "$unwind": "$event"
    },
    {
        "$unwind": "$event.eventPromChannelStores"
    },
    {
        "$match": {
            "event.eventPromChannelStores.promCode": {
                "$in": [22151900, "22312900"]
            }
        }
    }
])
db.getCollection("orderevents").aggregate([
    {
        "$match": {
            "targetBackend": "AX",
            "event.itemList.itemID": {
                "$in": ["1201722", "5350624"]
            },
            "event.itemList.itemPromChannels.promCode": {
                "$in": [22151900, 22222900]
            }
        }
    },
    {
        "$project": {
            "_id": 0,
            "event.itemList": 1
        }
    },
    {
        "$unwind": "$event"
    },
    {
        "$unwind": "$event.itemList"
    },
    {
        "$match": {
            "event.itemList.itemID": {
                "$in": ["1201722", "5350624"]
            },
        }
    },
    {
        "$unwind": "$event.itemList.itemPromChannels"
    },
    {
         "$match": {
            "event.itemList.itemPromChannels.promCode": {
                "$in": [22151900, 22222900]
            }
        }
    },
    {
        "$unwind": "$event.itemList.itemPromChannels.itemPromRegions"
    },
    {
        "$match": {
            "event.itemList.itemPromChannels.itemPromRegions.region":"BRI"
        }
    }, 
    {
        "$project": {
            "event.itemList.itemID": 1,
            "event.itemList.itemPromChannels.promCode": 1,
            "event.itemList.itemPromChannels.itemPromRegions.supplierMinOrder": 1,
        }
    }
])
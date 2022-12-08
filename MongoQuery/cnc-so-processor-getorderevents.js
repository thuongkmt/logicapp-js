db.getCollection("orderevents").aggregate([
    {
        "$match": {
            "parentEventGroup":"PL680"
        }
    },
    {
        "$project": {
            "_id":0,
            "targetBackend":0,
            "parentEventDescription":0,
            "orderOpenDate":0,
            "orderCloseDate": 0,
            "event.eventPromChannelStores":0,
            "event.itemStoreAllocation":0,
            "event.eventCode":0,
            "event.eventDescription":0,
            "event.saleType":0,
            "event.deliveryDate":0,
            "event.promStartDate":0,
            "event.consolidationDate":0,
            "event.adminOrderCloseDate":0,
            "event.promEndDate":0,
            "event.promPriceValidFrom":0,
            "event.promPriceValidTo":0,
            "legend": 0,
            "__v":0,
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
                "$in":["2485100", "2023349"]
            }
        }
    },
    {
        "$unwind": "$event.itemList.itemPromChannels"
    },
    {
        "$unwind": "$event.itemList.itemPromChannels.itemPromRegions"
    },
    {
        "$match": {
            "event.itemList.itemPromChannels.itemPromRegions.region": "NSW"
        }
    },
    {
        "$project" : {
            "event.itemList.itemPromChannels.promProdNo": 0,
            "event.itemList.itemPromChannels.catSubGroup": 0,
            "event.itemList.itemPromChannels.catPage": 0,
            "event.itemList.itemPromChannels.catGroup": 0,
            "event.itemList.itemPromChannels.comments": 0,
            "event.itemList.itemPromChannels.allocationRule": 0
        }
    },
    {
        "$group": {
            "_id": {
                "parentEventGroup": "$parentEventGroup"
            },
            "itemLists": {
                "$push": {
                    "itemID": "$event.itemList.itemID",
                    "itemPromRegions": "$event.itemList.itemPromChannels.itemPromRegions",
                    "itemPromPricing": "$event.itemList.itemPromChannels.itemPromPricing"
                }
            }
        }
    }
])

db.getCollection("orderevents").aggregate([
    {
        "$match": {
            "targetBackend":"AX",
            "event.eventPromChannelStores.storeList.storeID":"104836",
            "event.eventPromChannelStores.orderSubmitPromID":"PL910",
            "event.eventPromChannelStores.storeList.visible":"Y"
        }
    },
    {
        "$project": {
            "event.eventCode": 1,
            "event.eventPromChannelStores.orderSubmitPromID": 1,
            "event.eventPromChannelStores.promCode": 1,
            "event.eventPromChannelStores.promPrefSeq": 1,
            "event.eventPromChannelStores.storeList": 1,
            "event.itemList.itemID": 1,
            "event.itemList.itemPromChannels": 1,
            "event.saleType": 1,
            "orderCloseDate": 1,
            "orderOpenDate": 1,
            "targetBackend": 1
        }
    },
    {
        "$unwind": "$event"
    },
    {
        "$unwind": "$event.eventPromChannelStores"
    },
    {
        "$unwind": "$event.eventPromChannelStores.storeList"
    },
    {
        "$match": {
            "event.eventPromChannelStores.storeList.storeID": "104836",
            "event.eventPromChannelStores.storeList.visible": "Y"
        }
    },
    {
        "$unwind": "$event.itemList"
    },
    {
        "$match": {
            "event.itemList.itemID": {
                "$in":[
                    "1033422",
                    "1033455",
                    "1222520",
                    "1791631",
                    "1791656",
                    "2166353"
                ]
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
            "event.itemList.itemPromChannels.itemPromRegions.region": "BRI"
        }
    },
    {
        "$unwind": "$event.itemList.itemPromChannels.itemPromPricing"
    },
    {
        "$match": {
            "event.itemList.itemPromChannels.itemPromPricing.promPriceLUKey": "BRI"
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
            "_id" : {
                "productId":"$_id",
                "targetBackend":"$targetBackend",
                "orderOpenDate":"$orderOpenDate",
                "orderCloseDate":"$orderCloseDate",
                "event": {
                    "eventCode":"$event.eventCode",
                    "saleType":"$event.saleType",
                    "eventPromChannelStores":"$event.eventPromChannelStores"
                },
                
            },
            "itemLists": {
                "$push": {
                  "itemID":"$event.itemList.itemID",
                  "itemPromChannels":"$event.itemList.itemPromChannels"
                }
            }
        }
    },
    {
       "$group": {
        "_id": {
            "targetBackend":"$$ROOT._id.targetBackend",
            "orderOpenDate":"$$ROOT._id.orderOpenDate",
            "orderCloseDate":"$$ROOT._id.orderCloseDate"
        },
         "events": {
            "$push": {
                "event":"$$ROOT._id.event",
                "itemLists":"$$ROOT.itemLists"
            }
           }
       }
   }
])

db.getCollection("stores").find(
    {
        "id":"549055"
    },
    {
        "_id": 0,
        "storeName": 1,
        "address": 1,
        "brand":"",
        "chargebackState": 1,
        "promRegion": 1
    }
)

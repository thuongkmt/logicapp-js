db.getCollection("staging").updateMany(
    {
        "processing": 0,
        "orderType": "Promo",
        "consolidationDate": "2022-12-15T15:00:00.000Z"
    },
    {
        "$set": {
           "processing": 0,
           "consolidationDate" : "2022-12-30T15:00:00.000Z"
        }
    }
)

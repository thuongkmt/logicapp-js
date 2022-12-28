db.getCollection("staging").updateMany(
    {
        "processing": 1,
        "orderType": "Promo",
        "consolidationDate" : "2022-12-27T14:15:00.000Z"
    },
    {
        "$set": {
           "processing": 0,
           "consolidationDate" : "2022-12-28T14:15:00.000Z"
        }
    }
)

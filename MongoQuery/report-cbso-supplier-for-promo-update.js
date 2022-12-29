db.getCollection("staging").updateMany(
    {
        "processing": 2,
        "orderType": "Promo",
        "consolidationDate" : "2022-12-29T14:15:00.000Z"
    },
    {
        "$set": {
           "processing": 0,
           "consolidationDate" : "2022-12-29T14:15:00.000Z"
        }
    }
)

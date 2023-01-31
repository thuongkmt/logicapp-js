db.getCollection("staging").updateMany(
    {
       "processing": 2,
        "orderType": "Promo",
        "promId" :"PL205",
        "consolidationDate" : "2023-01-12T15:00:00.000Z"
    },
    {
        "$set": {
            "processing": 0,
           "consolidationDate" : "2023-01-12T15:00:00.000Z"
        }
    }
)

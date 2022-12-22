db.getCollection("staging").updateMany(
    {
        "orderType": "Promo",
        "consolidationDate":"2022-08-26T14:15:00.000Z"
    },
    {
        "$set": {
            "consolidationDate": "2022-12-22T14:15:00.000Z"
        }
    }
)

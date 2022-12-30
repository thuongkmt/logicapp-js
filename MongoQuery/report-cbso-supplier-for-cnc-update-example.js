db.getCollection("staging").updateMany(
    {
        "processing": 2,
        "orderType": "CNC"
    },
    {
        "$set": {
           "processing": 0
        }
    }
)

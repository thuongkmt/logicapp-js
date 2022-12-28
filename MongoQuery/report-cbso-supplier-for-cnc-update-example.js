db.getCollection("staging").updateMany(
    {
        "processing": 1,
        "orderType": "CNC"
    },
    {
        "$set": {
           "processing": 0
        }
    }
)

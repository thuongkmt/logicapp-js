db.getCollection("staging").updateMany(
    {
        "_id": {
            "$in": [{$toObjectId: "63982c08510191ece582debe"}]
        }
    },
    {
        "$set": {
            "processing": 3
        }
    }
)

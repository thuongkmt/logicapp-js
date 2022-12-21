db.getCollection("staging").updateMany(
    {    
        "_id": {
            "$in": [ObjectId("63982c08510191ece582debe")]
        }
    },    
    {
        "$set": {
            "docNo": 1
        }
    }
)
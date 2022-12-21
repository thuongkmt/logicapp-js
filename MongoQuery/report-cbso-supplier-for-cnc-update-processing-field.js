db.getCollection("staging").updateMany(
    {    
        "orderType": "CNC"
    },    
    {
        "$set": {
            "processing": 0
        }
    }
)
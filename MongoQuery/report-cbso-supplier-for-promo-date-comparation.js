db.getCollection("staging").aggregate([
    {
        "$match":{
            "orderType":"Promo",
            "processing": 0
        }
    },
    {
        "$addFields": {
            "consolidationDate": {
                "$toLong": {
                    "$toDate": "$consolidationDate"
                }
            }
        }
    },
    {
        "$match":{
            "$and": [
                {"consolidationDate": {"$gt": 1661436900000}}, 
                {"consolidationDate": {"$lt": 1661609700000}}
            ]
        }
    },
    {
        "$project":{
            "consolidationDate": 1
        }
    }
])

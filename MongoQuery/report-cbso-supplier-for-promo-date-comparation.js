db.getCollection("staging").aggregate([
    {
        "$match":{
            "orderType":"Promo",
            "processing": 0
        }
    },
    {
        "$addFields": {
            "consolidationDateString": {
                "$substr": [ "$consolidationDate", 0, 10 ]
            }
        }
    },
    {
        "$match":{
            "$and": [
                {"consolidationDateString": {"$eq": "2022-08-26"}}, 
            ]
        }
    },
    {
        "$group": {
            "_id": "$consolidationDateString",
            "myCount": {"$sum": 1}
        }
    }
])

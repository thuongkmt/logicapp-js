db.getCollection("supplier").aggregate([
    {
        "$match": {
            "id": {
                "$in": ["5598","5603","8717","5593","7693","1050","1437"]
            }
        }
    },
    {
        "$project":{
            "_id": 0,
            "name": 1,
            "supplierContactName": 1,
            "supplierContactPhone": 1,
            "supplierContactEmail": 1
        }
    }
])

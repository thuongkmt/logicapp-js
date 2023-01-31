db.getCollection("staging").updateMany(
    {
        "processing": 2,
        "orderType": "CNC",
        "docNo": {
        "$in": [
            10000465,
            10000466,
            10000467,
            10000468,
            10000469,
            10000470
          ]
    }
    },
    {
        "$set": {
           "processing": 0
        }
    }
)

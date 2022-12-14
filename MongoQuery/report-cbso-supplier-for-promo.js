db.getCollection("staging").aggregate([
    {
        "$match": {
            "processing": 0,
            "orderType": "Promo"
        }
    }
])

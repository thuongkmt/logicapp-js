db.getCollection("products").aggregate([
    {
        "$match": {
            "apn": {
                "$in": [
                    "9310046203817",
                    "93355766",
                    "9300611074119",
                    "9300611074089",
                    "9300611074133",
                    "9300611074157",
                    "9300611329301"
                ]
            },
            "targetBackend": "AX"
        }
    },
    {
        "$project": {
            "_id": 0,
            "apn": 1,
            "nationalRetailSrp": 1,
            "productCost.priceLUKey": 1,
            "productCost.suppliers.ProductCostBreaks": 1,
            "productCost.suppliers.supplierId": 1,
            "targetBackend": 1
        }
    },
    {
        "$unwind": "$productCost"
    },
    {
         "$match": {
            "productCost.priceLUKey": "WH:BRI:BRI"
        }
    },
    {
        "$unwind": "$productCost.suppliers"
    },
    {
         "$match": {
            "productCost.suppliers.supplierId": "0"
        }
    }
])

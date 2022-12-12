db.getCollection("products").aggregate([
     {
         "$match": {
            "targetBackend":"AX",
            "_id": {
                "$in":["1013812", "1017268", "1018076", "1018381"]
            }
        }
     },
    {
       "$project": {
            "departmentName": 1,
            "vpn": {
                "$arrayElemAt": ["$productDC.vpn", 0 ]
            },
            "supplierNo": {
                "$arrayElemAt": ["$productDC.supplierNo", 0]
            }
       }
    }
])
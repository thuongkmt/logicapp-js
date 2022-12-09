db.getCollection("products").aggregate([
     {
         "$match": {
            "targetBackend":"AX",
            "_id": "1013812",
            "productDC.supplierNo": "9968"
        }
     },
    {
       "$project": {
            "_id": 0,
            "departmentName": 1,
            "vpn": {
                "$arrayElemAt": [ "$productDC.vpn", 0 ]
            }
       }
    }
])
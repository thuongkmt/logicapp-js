db.getCollection("products").aggregate([
     {
         "$match": {
            "targetBackend":"AX",
            "_id": {
                "$in":["1013812"]
            },
            "productDC.supplierNo": {
                "$in": ["9968"]
            }
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
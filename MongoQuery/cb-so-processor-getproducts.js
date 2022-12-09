db.getCollection("products").aggregate([
     {
         "$match": {
            "targetBackend":"AX",
            "_id": {
                "$in":["1011451","1013812","1017268","1018076","1018381","1018464"]
            },
            "productDC.supplierNo": {
                "$in": ["1827", ]
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
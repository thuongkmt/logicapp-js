db.getCollection("supplier").find(
    {
        "id":"5598"
    },
    {
        "_id": 0,
        "name": 1,
        "supplierContactName": 1,
        "supplierContactPhone": 1,
        "supplierContactEmail": 1
    }
)

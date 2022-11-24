db.getCollection("userprofiles").find(
    {
        "item":"journal"
    }, 
    {
        "_id" : 0.0,
        "item" : 1.0,
        "status" : 1.0
    }
)

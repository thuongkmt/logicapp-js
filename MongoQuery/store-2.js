db.getCollection("stores").find({
    "promRegion": "VIC"
},
    {
        "_id":0,
        "promRegion":1,
        "cbPriceLuKey":1
    })

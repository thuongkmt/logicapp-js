const fs = require('fs')


fs.readFile("./raw-orderevents.json", "utf8", (err, data) => {
    if (err) {
        console.log("File read failed:", err);
        return;
    }

    orderEvents = JSON.parse(data);
    let itemIds = []
    orderEvents.event.forEach(event => {
        event.itemList.filter(item => {
            itemIds.push(item.itemID)
        })
    })

    console.log("itemIds", itemIds.length)
    // WRITE ALL ITEMID TO FILE

    fs.writeFile("./get-item-id-data.json", JSON.stringify(itemIds), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
})
const fs = require("fs")

fs.readFile("./data-test-kit/events-gus-full.json","utf8",(err, data) =>{
    if(err){
        console.log("File read failed:", err);
        return;
    }
    var orderEvents  = JSON.parse(data)[0]
    
    //START PROCESSING
    orderEvents.events.map(item =>{
        if(!item.event.eventPromChannelStores.storeList.hasOwnProperty("orderCloseDateOverride")){
            item.event.eventPromChannelStores.storeList.orderCloseDateOverride = orderEvents._id.orderCloseDate
        }
    })
    orderEvents.events.sort((a, b) => (Date.parse(b.event.eventPromChannelStores.storeList.orderCloseDateOverride) - Date.parse(a.event.eventPromChannelStores.storeList.orderCloseDateOverride)))

    const orderCloseDateTimeStamp = isNaN(Date.parse(orderEvents._id.orderCloseDate)) == true ? 0 : Date.parse(orderEvents._id.orderCloseDate)
    let orderCloseDateOverride = orderEvents._id.orderCloseDate
    let biggestCloseDateOverride = orderEvents.events[0]
    if(biggestCloseDateOverride.event.eventPromChannelStores.storeList.hasOwnProperty("orderCloseDateOverride")){
        const currentDateString = biggestCloseDateOverride.event.eventPromChannelStores.storeList.orderCloseDateOverride
        let currentDateTimeStamp = isNaN(Date.parse(currentDateString)) == true ? 0 : Date.parse(currentDateString)
        if(currentDateTimeStamp > orderCloseDateTimeStamp){
            orderCloseDateOverride = currentDateString
        }
    }
    //END PROCESSING

    fs.writeFile("./data-result/order-events-sorted.json", JSON.stringify(orderEvents), (err) =>{
        if(!err){
            console.log("order-events-sorted", "saved in file")        
        }
    })
})

  
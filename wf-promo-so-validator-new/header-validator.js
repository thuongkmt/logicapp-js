const fs = require("fs")

fs.readFile("./data-test-kit/events-gus.json","utf8",(err, data) =>{
    if(err){
        console.log("File read failed:", err);
        return;
    }
    var orderEvents  = JSON.parse(data)[0]

    const orderCloseDateTimeStamp = isNaN(Date.parse(orderEvents._id.orderCloseDate)) == true ? 0 : Date.parse(orderEvents._id.orderCloseDate)
    let orderCloseDateOverride = orderEvents._id.orderCloseDate
    console.log("orderCloseDateOverride", orderCloseDateOverride)
    orderEvents.events.every(item =>{
        if(item.event.eventPromChannelStores.storeList.hasOwnProperty("orderCloseDateOverride")){
            const currentDateString = item.event.eventPromChannelStores.storeList.orderCloseDateOverride
            let currentDateTimeStamp = isNaN(Date.parse(currentDateString)) == true ? 0 : Date.parse(currentDateString)
            console.log("currentDateString", currentDateString)
            if(currentDateTimeStamp > orderCloseDateTimeStamp){
                orderCloseDateOverride = currentDateString
                return false
            }
            else return true
        }
    })

    console.log("orderCloseDateOverride", orderCloseDateOverride)
})
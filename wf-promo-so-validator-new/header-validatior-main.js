const orderEvents = workflowContext.actions.Parse_JSON_orderEvents.outputs.body[0]

//sort orderCloseDateOverride
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

return {
    orderCloseDateOverride,
    orderEvents
}

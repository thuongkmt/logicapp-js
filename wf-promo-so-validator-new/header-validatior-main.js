const orderEvents = workflowContext.actions.Parse_JSON_orderEvents.outputs.body[0]

const orderCloseDateTimeStamp = isNaN(Date.parse(orderEvents._id.orderCloseDate)) == true ? 0 : Date.parse(orderEvents._id.orderCloseDate)
let orderCloseDateOverride = orderEvents._id.orderCloseDate
orderEvents.events.every(item =>{
    if(item.event.eventPromChannelStores.storeList.hasOwnProperty("orderCloseDateOverride")){
        const currentDateString = item.event.eventPromChannelStores.storeList.orderCloseDateOverride
        let currentDateTimeStamp = isNaN(Date.parse(currentDateString)) == true ? 0 : Date.parse(currentDateString)
        if(currentDateTimeStamp > orderCloseDateTimeStamp){
            orderCloseDateOverride = currentDateString
            return false
        }
        else return true
    }
})

return orderCloseDateOverride

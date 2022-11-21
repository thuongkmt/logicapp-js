const events = workflowContext.actions.Parse_JSON_orderEvents.outputs.body[0].event
const promotionId = workflowContext.trigger.outputs.body.promotionId
const storeNumber = workflowContext.trigger.outputs.body.storeNumber
const isYes = "Y"

var newEvents = events.map(event => { 
    event.eventPromChannelStores = event.eventPromChannelStores.filter(el=> el.orderSubmitPromID == promotionId)
    if(event.eventPromChannelStores.length > 0){
        event.eventPromChannelStores.map(epcs => {
            epcs.storeList = epcs.storeList.filter(el => el.storeID == storeNumber && el.visible == isYes)
            if(epcs.storeList.length > 0){
                return epcs
            }
        })
        return event
    }
}).map(ev => {
    ev.eventPromChannelStores = ev.eventPromChannelStores.filter(el => el.storeList.length > 0)
    return ev
}).filter(el => el.eventPromChannelStores.length > 0)

return newEvents
const orderEvents = workflowContext.actions.ExeJavaScriptCode_getOrderCloseDateOverride.outputs.orderEvents
const sourceSystem = workflowContext.trigger.outputs.body.sourceSystem
const createdTime = workflowContext.trigger.outputs.body.createdTime

var isBreakLoop = false
var quantityOrderedAdjusted = 0;
var storeOrderMult = 0;

//differentiate which event is out of date
let createdTimeTimestamp = isNaN(Date.parse(createdTime)) == true ? 0 : Date.parse(createdTime)
orderEvents.events.map(item => {
    const orderCloseDateOverride = item.event.eventPromChannelStores.storeList.orderCloseDateOverride
    var orderCloseDateOverrideTimestamp = isNaN(Date.parse(orderCloseDateOverride)) == true ? 0 : Date.parse(orderCloseDateOverride)
    if(createdTimeTimestamp <= orderCloseDateOverrideTimestamp){
        item.event.status = "Open"
    }
    else{
        item.event.status = "Close"
    }

    return item
})
//sorted by promPrefSeq but status is "Open"
orderEvents.events.sort((a, b) => {
    if(a.event.status === "Open"){
        return a.event.eventPromChannelStores.promPrefSeq - b.event.eventPromChannelStores.promPrefSeq
    }
})

return orderLines.map(orderLine => { 
    if(orderLine.status == "05"){
        orderLine.promSource = ""
    }
    else{
        isBreakLoop = false;
        let loopEventsCount = 0 
        orderEvents.events.forEach(item => {
            loopEventsCount ++
            //1.check itemID is equal to itemCode
            if(!isBreakLoop){
                let loopItemIdCount = 0
                let isItemIdExist = false
                let promCode, itemPromRegions, itemPromPrcing

                item.itemLists.filter(il => {
                    loopItemIdCount ++
                    if(il.itemID === orderLine.itemCode && item.event.eventPromChannelStores.promCode === il.itemPromChannels.promCode){
                        promCode        = il.itemPromChannels.promCode
                        itemPromRegions = il.itemPromChannels.itemPromRegions
                        itemPromPrcing  = il.itemPromChannels.itemPromPricing
                        isBreakLoop     = true

                        switch(sourceSystem){
                            case "GUS":
                                //In case: sourceSystem comes from GUS, we already had the promotion value
                                if(promCode == orderLine.promotion){                                 
                                    //map  quantityOrderedAdjusted/status/statusComment
                                    orderLine.quantityOrderedAdjusted = orderLine.quantityOrdered
                                    orderLine.status = "01"
                                    orderLine.statusComment = "Fully Supplied"                 
                                    
                                    orderLine.srpIncTax = itemPromPrcing.promSRP      
                                    //order the array desc
                                    let promBreaks = [] 
                                    for(let i=1; i<=6; i++){
                                        promBreaks.push(itemPromPrcing[`promBreak${i}_Qty`] === undefined ? 0 : itemPromPrcing[`promBreak${i}_Qty`])
                                    }
                                    promBreaks.sort(function(a, b){return b - a});
                                    
                                    //get the promBreak${i}_Qty nearest to the orderLine.quantityOrderedAdjusted
                                    let isStop = false
                                    promBreaks.forEach(promBreak => {
                                        if(!isStop){
                                            for(let i=1; i<=6; i++){
                                                if(itemPromPrcing[`promBreak${i}_Qty`] === promBreak){
                                                    if(orderLine.quantityOrderedAdjusted >= itemPromPrcing[`promBreak${i}_Qty`]) {
                                                        orderLine.totalLinesAmountAfterTax = parseFloat((orderLine.quantityOrderedAdjusted * itemPromPrcing[`promCost${i}_AT`]).toFixed(2))
                                                        orderLine.costBeforeTax = parseFloat(itemPromPrcing[`promCost${i}_BT`].toFixed(2))
                                                        orderLine.revisedListCost = parseFloat(itemPromPrcing[`promCost${i}_BT`].toFixed(2))
                                                        isStop = true
                                                        break
                                                    } 
                                                    else{
                                                        orderLine.totalLinesAmountAfterTax = 0
                                                        orderLine.costBeforeTax = 0
                                                        orderLine.revisedListCost = 0
                                                    }   
                                                }
                                            }  

                                            return false
                                        }
                                        else return true
                                    })
                                }
                                else{
                                    if(itemPromChannels.length === loopPromCodeCount) {
                                        if(!isPromCodeExist){
                                            orderLine.status = "97"
                                            orderLine.statusComment = "Not On Promotion"
                                            orderLine.promSource = ""
                                        }
                                    }
                                }
                                break

                            default:
                                //map promotion data
                                orderLine.promotion = promCode
                                
                                //map quantityOrderedAdjusted with minimum quantity - Set value of "orderItem.quantityOrderedAdjusted" to be value of "orderItem.quantityOrdered"
                                if(orderLine.quantityOrdered >= itemPromRegions.storeOrderMin)
                                {
                                    quantityOrderedAdjusted = orderLine.quantityOrdered
                                    orderLine.status = "01"
                                    orderLine.statusComment = "Fully Supplied"
                                }
                                else
                                {
                                    quantityOrderedAdjusted = itemPromRegions.storeOrderMin
                                    orderLine.status = "33"
                                    orderLine.statusComment = "Rounded up to Minimum"
                                }

                                //map quantityOrderedAdjusted with qty-multiple - If value of "orderItem.quantityOrderedAdjusted" is greater/closet of quantityOrderedAdjusted and a multiple of "StoreOrderMult"
                                if(quantityOrderedAdjusted % itemPromRegions.storeOrderMult != 0)
                                {
                                    if(quantityOrderedAdjusted > itemPromRegions.storeOrderMult)
                                    {
                                        let i = 2
                                        while(itemPromRegions.storeOrderMult * i < quantityOrderedAdjusted){
                                            i++
                                        }
                                        quantityOrderedAdjusted = itemPromRegions.storeOrderMult * i

                                    }
                                    
                                    else
                                        quantityOrderedAdjusted = itemPromRegions.storeOrderMult
                                    
                                    orderLine.status = "04"
                                    orderLine.statusComment = "Raised to Pack Quantity"
                                }
                                orderLine.quantityOrderedAdjusted = quantityOrderedAdjusted
                                
                                //map promSource data
                                orderLine.promSource = itemPromRegions.promSource
                                
                                //map warehouseId data
                                switch(itemPromRegions.promSource){
                                    case "W":
                                        orderLine.warehouseId = "" 
                                        break;
                                    case "C":
                                        orderLine.warehouseId = itemPromRegions.supplierID
                                        break;
                                    default:
                                        orderLine.warehouseId = "" 
                                        break;
                                }

                                //map uom data
                                orderLine.uom = itemPromRegions.salesUOM

                                //map srpIncTax, totalLinesAmountAfterTax, costBeforeTax data
                                orderLine.srpIncTax = itemPromPrcing.promSRP

                                //order the array desc
                                let promBreaks = [] 
                                for(let i=1; i<=6; i++){
                                    promBreaks.push(itemPromPrcing[`promBreak${i}_Qty`] === undefined ? 0 : itemPromPrcing[`promBreak${i}_Qty`])
                                }
                                promBreaks.sort(function(a, b){return b - a});

                                //get the promBreak${i}_Qty nearest to the orderLine.quantityOrderedAdjusted
                                let isStop = false
                                promBreaks.forEach(promBreak => {
                                    if(!isStop){
                                        for(let i=1; i<=6; i++){
                                            if(itemPromPrcing[`promBreak${i}_Qty`] === promBreak){
                                                if(orderLine.quantityOrderedAdjusted >= itemPromPrcing[`promBreak${i}_Qty`]) {
                                                    orderLine.totalLinesAmountAfterTax = parseFloat((orderLine.quantityOrderedAdjusted * itemPromPrcing[`promCost${i}_AT`]).toFixed(2))
                                                    orderLine.costBeforeTax = parseFloat(itemPromPrcing[`promCost${i}_BT`].toFixed(2))
                                                    orderLine.revisedListCost = parseFloat(itemPromPrcing[`promCost${i}_BT`].toFixed(2))
                                                    isStop = true
                                                    break
                                                } 
                                                else{
                                                    orderLine.totalLinesAmountAfterTax = 0
                                                    orderLine.costBeforeTax = 0
                                                    orderLine.revisedListCost = 0
                                                }   
                                            }
                                        }  

                                        return false
                                    }
                                    else return true
                                })
                            break
                        }
                    }
                    else{
                        if(loopItemIdCount === item.itemLists.length && loopEventsCount === orderEvents.events.length){
                            if(!isItemIdExist){
                                orderLine.status = "97"
                                orderLine.statusComment = "Not On Promotion"
                                orderLine.promSource = ""
                            }
                            
                        }
                    }
                })
            }
        }) 
    }

    return orderLine
});
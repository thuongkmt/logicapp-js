const orderEvents = workflowContext.actions.ExeJavaScriptCode_getOrderCloseDateOverride.outputs.orderEvents
const promRegions = workflowContext.actions.Get_stores_from_ESL.outputs.body
const sourceSystem = workflowContext.trigger.outputs.body.sourceSystem
const createdTime = workflowContext.trigger.outputs.body.createdTime
const orderLines = workflowContext.trigger.outputs.body.orderLines

var isBreakLoop = false
var quantityOrderedAdjusted = 0
var storeOrderMult = 0
var salesOrderStatus = false

 //in case sourceSystem equal to GUS default event.status is Open
 if(sourceSystem === "GUS"){
    orderEvents.events.map(item => {
        item.event.status = "Open"
        return item
    })
 }
 else{
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
 }

//sorted by promPrefSeq but status is "Open"
orderEvents.events.sort((a, b) => {
    if(a.event.status === "Open"){
        return a.event.eventPromChannelStores.promPrefSeq - b.event.eventPromChannelStores.promPrefSeq
    }
})

orderLines.map(orderLine => { 
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
                item.itemLists.every(il => {
                    loopItemIdCount ++
                    if(il.itemID === orderLine.itemCode){
                        let itemPromChannels = il.itemPromChannels
                        //2. check event.eventPromChannelStores is equal to itemList.itemPromChannels.promCode
                        let loopPromCodeCount = 0
                        itemPromChannels.every(ipc => {
                            loopPromCodeCount ++
                            switch(sourceSystem){
                                case "GUS":
                                    //In case: sourceSystem comes from GUS, we already had the promotion value
                                    if(ipc.promCode == orderLine.promotion){                                
                                        //map  quantityOrderedAdjusted/status/statusComment
                                        orderLine.quantityOrderedAdjusted = orderLine.quantityOrdered
                                        orderLine.status = "01"
                                        orderLine.statusComment = "Fully Supplied"                  

                                        isBreakLoop =true
                                        let itemPromPrcing = ipc.itemPromPricing
                                        let loopPromPriceLUKeyCount = 0
    
                                        itemPromPrcing.every(ipp => {
                                            loopPromPriceLUKeyCount++
                                            if(ipp.promPriceLUKey === promRegions[0]["promPriceLUKey"]){
                                                orderLine.srpIncTax = ipp.promSRP
                                                
                                                //order the array desc
                                                let promBreaks = [] 
                                                for(let i=1; i<=6; i++){
                                                    promBreaks.push(ipp[`promBreak${i}_Qty`] === undefined ? 0 : ipp[`promBreak${i}_Qty`])
                                                }
                                                promBreaks.sort(function(a, b){return b - a});
                                                //get the promBreak${i}_Qty nearest to the orderLine.quantityOrderedAdjusted
                                                let isStop = false
                                                promBreaks.forEach(promBreak => {
                                                    if(!isStop){
                                                        for(let i=1; i<=6; i++){
                                                            if(ipp[`promBreak${i}_Qty`] === promBreak){
                                                                console.log("promBreak", `${promBreak} - ${ipp[`promBreak${i}_Qty`]}`)
                                                                if(orderLine.quantityOrderedAdjusted >= ipp[`promBreak${i}_Qty`]) {
                                                                    orderLine.totalLinesAmountAfterTax = parseFloat((orderLine.quantityOrderedAdjusted * ipp[`promCost${i}_AT`]).toFixed(2))
                                                                    orderLine.costBeforeTax = parseFloat(ipp[`promCost${i}_BT`].toFixed(2))
                                                                    orderLine.revisedListCost = parseFloat(ipp[`promCost${i}_BT`].toFixed(2))
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

                                                return false
                                            }
                                            else{
                                                if(itemPromPrcing.length === loopPromPriceLUKeyCount){
                                                    orderLine.srpIncTax = 0
                                                }
                                                
                                            }

                                            return true
                                        })

                                        return false
                                    }
                                    else{
                                        if(itemPromChannels.length === loopPromCodeCount) {
                                            orderLine.status = "97"
                                            orderLine.statusComment = "Not On Promotion"
                                            orderLine.promSource = ""
                                        }
                                    }

                                    break
    
                                default:
                                    if(ipc.promCode === item.event.eventPromChannelStores.promCode){
                                        let itemPromRegions = ipc.itemPromRegions
                                        let itemPromPrcing = ipc.itemPromPricing
                                        
                                        if(item.event.status === "Open"){
                                            //checking in the itemPromRegions
                                            let loopPromRegionCount = 0
                                            itemPromRegions.every(ipr => {
                                                loopPromRegionCount++
                                                if(ipr.region === promRegions[0]["promRegion"]) {
                                                    isBreakLoop = true
        
                                                    //map promotion data
                                                    orderLine.promotion = item.event.eventPromChannelStores.promCode
                                                    
                                                    //map quantityOrderedAdjusted with minimum quantity - Set value of "orderItem.quantityOrderedAdjusted" to be value of "orderItem.quantityOrdered"
                                                    if(orderLine.quantityOrdered >= ipr.storeOrderMin)
                                                    {
                                                        quantityOrderedAdjusted = orderLine.quantityOrdered
                                                        orderLine.status = "01"
                                                        orderLine.statusComment = "Fully Supplied"
                                                    }
                                                    else
                                                    {
                                                        quantityOrderedAdjusted = ipr.storeOrderMin
                                                        orderLine.status = "33"
                                                        orderLine.statusComment = "Rounded up to Minimum"
                                                    }
                
                                                    //map quantityOrderedAdjusted with qty-multiple - If value of "orderItem.quantityOrderedAdjusted" is greater/closet of quantityOrderedAdjusted and a multiple of "StoreOrderMult"
                                                    if(quantityOrderedAdjusted % ipr.storeOrderMult != 0)
                                                    {
                                                        if(quantityOrderedAdjusted > ipr.storeOrderMult)
                                                        {
                                                            let i = 2
                                                            while(ipr.storeOrderMult * i < quantityOrderedAdjusted){
                                                                i++
                                                            }
                                                            quantityOrderedAdjusted = ipr.storeOrderMult * i

                                                        }
                                                        
                                                        else
                                                            quantityOrderedAdjusted = ipr.storeOrderMult
                                                        
                                                        orderLine.status = "04"
                                                        orderLine.statusComment = "Raised to Pack Quantity"
                                                    }
                                                    orderLine.quantityOrderedAdjusted = quantityOrderedAdjusted
                                                    
                                                    //map promSource data
                                                    orderLine.promSource = ipr.promSource
                                                    
                                                    //map warehouseId data
                                                    switch(ipr.promSource){
                                                        case "W":
                                                            orderLine.warehouseId = "" 
                                                            break;
                                                        case "C":
                                                            orderLine.warehouseId = ipr.supplierID
                                                            break;
                                                        default:
                                                            orderLine.warehouseId = "" 
                                                            break;
                                                    }
                                                    //map uom data
                                                    orderLine.uom = ipr.salesUOM
        
                                                    //map srpIncTax, totalLinesAmountAfterTax, costBeforeTax data
                                                    let loopPromPriceLUKeyCount = 0
                                                    itemPromPrcing.every(ipp =>{
                                                        loopPromPriceLUKeyCount++
                                                        if(ipp.promPriceLUKey === promRegions[0]["promPriceLUKey"]){
                                                            orderLine.srpIncTax = ipp.promSRP

                                                            //order the array desc
                                                            let promBreaks = [] 
                                                            for(let i=1; i<=6; i++){
                                                                promBreaks.push(ipp[`promBreak${i}_Qty`] === undefined ? 0 : ipp[`promBreak${i}_Qty`])
                                                            }
                                                            promBreaks.sort(function(a, b){return b - a});
                                                            //get the promBreak${i}_Qty nearest to the orderLine.quantityOrderedAdjusted
                                                            let isStop = false
                                                            promBreaks.forEach(promBreak => {
                                                                if(!isStop){
                                                                    for(let i=1; i<=6; i++){
                                                                        if(ipp[`promBreak${i}_Qty`] === promBreak){
                                                                            if(orderLine.quantityOrderedAdjusted >= ipp[`promBreak${i}_Qty`]) {
                                                                                orderLine.totalLinesAmountAfterTax = parseFloat((orderLine.quantityOrderedAdjusted * ipp[`promCost${i}_AT`]).toFixed(2))
                                                                                orderLine.costBeforeTax = parseFloat(ipp[`promCost${i}_BT`].toFixed(2))
                                                                                orderLine.revisedListCost = parseFloat(ipp[`promCost${i}_BT`].toFixed(2))
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

                                                            return false
                                                        }
                                                        else{
                                                            if(itemPromPrcing.length === loopPromPriceLUKeyCount){
                                                                orderLine.srpIncTax = 0
                                                            }
                                                            
                                                        }

                                                        return true
                                                    })

                                                    return false
                                                }
                                                else{
                                                    if(itemPromRegions.length === loopPromRegionCount) {
                                                        orderLine.status = "97"
                                                        orderLine.statusComment = "Not On Promotion"
                                                        orderLine.promSource = ""
                                                    }
                                                }

                                                return true
                                            })
                                        }
                                        else{
                                            //UPDATE WHEN STATUS IS CLOSE
                                            isBreakLoop = true
                                            orderLine.status = "97"
                                            orderLine.statusComment = "Not On Promotion"
                                        }

                                        return false
                                        
                                    }
                                    else{
                                        if(itemPromChannels.length === loopPromCodeCount) {
                                            orderLine.status = "97"
                                            orderLine.statusComment = "Not On Promotion"
                                            orderLine.promSource = ""
                                        }
                                    }
                                    
                                    break
                            }

                            return true
                        })

                        return false
                    }
                    else{
                        if(loopItemIdCount === item.itemLists.length && loopEventsCount === orderEvents.events.length){
                            orderLine.status = "97"
                            orderLine.statusComment = "Not On Promotion"
                            orderLine.promSource = ""
                        }
                    }

                    return true
                })
            }
        }) 
    }

    return orderLine
})

//checking if at least one of the status in orderline is not matched to C, then reupdate the status of SalesOrder
orderLines.every(orderLine => {
    if(orderLine.status === "01" || orderLine.status === "04" || orderLine.status === "33"){
        salesOrderStatus = true;
        
        return false
    }
    else{
        return true
    }
})

//rerurn data
return {
    salesOrderStatus,
    orderLines
}
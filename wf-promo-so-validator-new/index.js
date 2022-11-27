const fs = require('fs')
const sourceSystem = "NOT-GUS";
const createdTime = "2022-09-28T02:07:51"

var promRegions = [];
var isBreakLoop = false
var promCode = "";
var orderEvents = [];

fs.readFile("./data-test-kit/events-gus.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
    orderEvents = JSON.parse(jsonString)[0];
    
    //differentiate which event is out of date
    let createdTimeTimestamp = isNaN(Date.parse(createdTime)) == true ? 0 : Date.parse(createdTime)
    let orderCloseDateTimestamp = isNaN(Date.parse(orderEvents._id.orderCloseDate)) == true ? 0 : Date.parse(orderEvents._id.orderCloseDate)
    
    orderEvents.events.map(item => {
        if(item.event.eventPromChannelStores.storeList.hasOwnProperty("orderCloseDateOverride")){
            const orderCloseDateOverride = item.event.eventPromChannelStores.storeList.orderCloseDateOverride
            var orderCloseDateOverrideTimestamp = isNaN(Date.parse(orderCloseDateOverride)) == true ? 0 : Date.parse(orderCloseDateOverride)
            if(createdTimeTimestamp <= orderCloseDateOverrideTimestamp){
                item.event.status = "Open"
            }
            else{
                item.event.status = "Close"
            }
        }
        else{
            if(createdTimeTimestamp <= orderCloseDateTimestamp){
                item.event.status = "Open"
            }
            else{
                item.event.status = "Close"
            }
        }

        return item
    })

    console.log("orderEvents", JSON.stringify(orderEvents))

    fs.readFile("./data-test-kit/orderLines-gus.json", "utf8", (err, jsonString) => {
        if (err) {
        console.log("File read failed:", err);
        return;
        }
        

        var orderLines = JSON.parse(jsonString);
        orderLines.map(orderLine => { 
            if(orderLine.status == "05"){
                orderLine.promSource = ""
            }
            else{
                isBreakLoop = false;
                let loopEventsCount = 0 
                events.forEach(event => {
                    loopEventsCount ++
                    //1.check itemID is equal to itemCode
                    if(!isBreakLoop){
                        let loopItemIdCount = 0
                        let isItemIdExist = false
                        event.itemList.filter(il => {
                            loopItemIdCount ++
                            if(il.itemID === orderLine.itemCode){
                                isItemIdExist = true
                                let itemPromChannels = il.itemPromChannels
                                //2. check event.eventPromChannelStores is equal to itemList.itemPromChannels.promCode
                                let loopPromCodeCount = 0
                                let isPromCodeExist = false
                                itemPromChannels.filter(ipc => {
                                    switch(sourceSystem){
                                        case "GUS":
                                            //In case: sourceSystem comes from GUS, we already had the promotion value
                                            loopPromCodeCount ++
                                            if(ipc.promCode == orderLine.promotion){      
                                                console.log("orderLine.productCode", `${orderLine.productCode}`)       
                                                console.log("orderLine.promotion", `${orderLine.promotion}`)                              
                                                //map  quantityOrderedAdjusted/status/statusComment
                                                orderLine.quantityOrderedAdjusted = orderLine.quantityOrdered
                                                orderLine.status = "01"
                                                orderLine.statusComment = "Fully Supplied"
                                                console.log("orderLine.promSource", `${orderLine.promSource}`)                    

                                                isPromCodeExist = true
                                                isBreakLoop =true
                                                let itemPromPrcing = ipc.itemPromPricing
                                                let loopPromPriceLUKeyCount = 0
                                                let isPromPriceLUKeyExist = false
            
                                                itemPromPrcing.filter(ipp => {
                                                    loopPromPriceLUKeyCount++
                                                    if(ipp.promPriceLUKey === promRegions[0]["promPriceLUKey"]){
                                                        isPromPriceLUKeyExist = true
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
                                                    }
                                                    else{
                                                        if(itemPromPrcing.length === loopPromPriceLUKeyCount){
                                                            if(!isPromPriceLUKeyExist){
                                                                orderLine.srpIncTax = 0
                                                            }
                                                        }
                                                        
                                                    }
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
                                            loopPromCodeCount ++
                                            event.eventPromChannelStores.forEach(epcs => {
                                                if(ipc.promCode === epcs.promCode){
                                                    let itemPromRegions = ipc.itemPromRegions
                                                    let itemPromPrcing = ipc.itemPromPricing
                                                    isPromCodeExist = true
                                                    
                                                    //checking in the itemPromRegions
                                                    let loopPromRegionCount = 0
                                                    let isPromRegionExist = false
                                                    itemPromRegions.filter(ipr => {
                                                        loopPromRegionCount++
                                                        if(ipr.region === promRegions[0]["promRegion"]) {
                                                            isBreakLoop = true
                                                            isPromRegionExist = true
                                                            promCode = epcs.promCode
                
                                                            //map promotion data
                                                            orderLine.promotion = promCode
                                                            
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
                                                            let isPromPriceLUKeyExist = false
                                                            itemPromPrcing.filter(ipp =>{
                                                                loopPromPriceLUKeyCount++
                                                                if(ipp.promPriceLUKey === promRegions[0]["promPriceLUKey"]){
                                                                    isPromPriceLUKeyExist = true
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
                                                                }
                                                                else{
                                                                    if(itemPromPrcing.length === loopPromPriceLUKeyCount){
                                                                        if(!isPromPriceLUKeyExist){
                                                                            orderLine.srpIncTax = 0
                                                                        }
                                                                    }
                                                                    
                                                                }
                                                            })
                                                        }
                                                        else{
                                                            if(itemPromRegions.length === loopPromRegionCount) {
                                                                if(!isPromRegionExist){
                                                                    orderLine.status = "97"
                                                                    orderLine.statusComment = "Not On Promotion"
                                                                    orderLine.promSource = ""
                                                                }
                                                            }
                                                        }
                                                    })
                                                    return false
                                                }
                                                else{
                                                    if(itemPromChannels.length === loopPromCodeCount) {
                                                        if(!isPromCodeExist){
                                                            orderLine.status = "97"
                                                            orderLine.statusComment = "Not On Promotion"
                                                            orderLine.promSource = ""
                                                        }
                                                    }
                                                    return true
                                                }
                                            })
                                        break
                                    }
                                    
                                })
                            }
                            else{
                                if(loopItemIdCount === event.itemList.length && loopEventsCount === events.length){
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
        
        //console.log("orderLines", JSON.stringify(orderLines[0]))
    })
});



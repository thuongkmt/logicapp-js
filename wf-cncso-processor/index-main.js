const orderLines = []
const orderEvents = []
const stores = []

const STATUS_05  = "05"
const WAREHOUSE  = "W"
const CHARGEBACK = "C"
let isPromotion = false;

orderLines.map(orderLine =>{
    //set this quantityOederAdjusted equal to quantityOrdered for later flow service
    orderLine.quantityOrderedAdjusted = orderLine.quantityOrdered

    if(orderLine.status === STATUS_05){
        orderLine.promSource = WAREHOUSE
    }
    else{
        let itemLoopCount = 0
        //check itemCode
        orderEvents.itemLists.every(item =>{
            itemLoopCount ++
            if(orderLine.itemCode === item.itemID){
                orderLine.promSource = item.itemPromRegions.promSource
                    //check at least one item.itemPromRegions.promSource equal to promSource of W
                    switch(item.itemPromRegions.promSource){
                        case WAREHOUSE: 
                            isPromotion = true
                            break

                        case CHARGEBACK:
                            orderLine.warehouseId = item.itemPromRegions.supplierID
                            orderLine.uom = item.itemPromRegions.salesUOM
                            
                            //get the promBreak#_Qty data
                            item.itemPromPricing.every(itemPromPrice => {
                                if(stores.promPriceLUKey === itemPromPrice.promPriceLUKey ){
                                    //sort the promBreaks_Qty array
                                    let promBreaks_Qty = []
                                    for(let i=1; i<=6; i++){
                                        promBreaks_Qty.push(itemPromPrice[`promBreak${i}_Qty`] !== undefined ? itemPromPrice[`promBreak${i}_Qty`] : 0)
                                    }
                                    promBreaks_Qty.sort((a,b) => {return b-a});
                                    
                                    //compare the orderLine.quantityOrdered vs the biggest promBreak#_Qty
                                    if(orderLine.quantityOrdered >= promBreaks_Qty[0]){
                                        for(let i=1; i<=6; i++){
                                            if(itemPromPrice[`promBreak${i}_Qty`] === promBreaks_Qty[0]){
                                                orderLines.totalLinesAmountAfterTax = (itemPromPrice[`promCost${i}_AT`] * orderLine.quantityOrdered).toFixed(2)
                                                orderLines.costBeforeTax = itemPromPrice[`promCost${i}_BT`] 
                                                return false;
                                            }
                                        }
                                    }

                                    return false
                                }

                                return true
                            })
                            break

                        default: 
                            break
                    }
                    if(item.itemPromRegions.promSource === WAREHOUSE){
                        isPromotion = true
                    }

                return false
            }
            else{
                if(itemLoopCount === orderEvents.itemLists.length){
                    orderLine.promSource = WAREHOUSE
                }
            }
            return true
        })
    }
})

return {
    orderLines,
    isPromotion
}
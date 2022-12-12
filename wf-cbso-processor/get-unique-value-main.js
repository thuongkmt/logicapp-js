const orderLines = workflowContext.trigger.outputs.body.orderLines || []

let warehouseIds = []
let itemCodes = []
let promotions = []

orderLines.forEach(orderLine => {
    if(orderLine.warehouseId != ""){
        warehouseIds.push(orderLine.warehouseId)
    }
    if(orderLine.itemCode !=""){
        itemCodes.push(orderLine.itemCode)
    }
    if(orderLine.promotion != ""){
        promotions.push(orderLine.promotion)
    }
})
warehouseIds = [... new Set(warehouseIds)]
promotions = [... new Set(promotions)]
itemCodes = [... new Set(itemCodes)]
return {
    warehouseIds,
    promotions,
    itemCodes
}
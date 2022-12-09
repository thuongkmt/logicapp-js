const orderLines = workflowContext.trigger.outputs.body.orderLines || []

let warehouseIds = []
let itemCodes = []
let productApns = []
let promotions = []

orderLines.forEach(orderLine => {
    if(orderLine.warehouseId != ""){
        warehouseIds.push(orderLine.warehouseId)
    }
    if(orderLine.itemCode !=""){
        itemCodes.push(orderLine.itemCode)
    }
    if(orderLine.productApn != ""){
        productApns.push(orderLine.productApn)
    }
    if(orderLine.promotion != ""){
        promotions.push(orderLine.promotion)
    }
})
warehouseIds = [... new Set(warehouseIds)]
productApns = [... new Set(productApns)]
promotions = [... new Set(promotions)]
itemCodes = [... new Set(itemCodes)]
return {
    warehouseIds,
    productApns,
    promotions,
    itemCodes
}
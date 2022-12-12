const fs = require('fs')

fs.readFile('./data-test-kit/orderlines.json', 'utf8', (error, data) =>{
    if(error){
        console.log("File reading", "Failed!")
        throw(error)
    }
    const orderLines = JSON.parse(data);
    
    //START PROCESSING
    let warehouseIds = []
    let itemCodes = []
    let promotions = []

    orderLines.forEach(orderLine => {
        if(orderLine.warehouseId != ""){
            warehouseIds.push(orderLine.warehouseId)
        }
        if(orderLine.itemCode != ""){
            itemCodes.push(orderLine.itemCode)
        }
        if(orderLine.promotion != ""){
            promotions.push(orderLine.promotion)
        }
    })
    warehouseIds = [... new Set(warehouseIds)]
    itemCodes = [... new Set(itemCodes)]
    promotions = [... new Set(promotions)]

    console.log("warehouseIds", warehouseIds)
    console.log("itemCodes", itemCodes)
    console.log("promotions", promotions)
    //END PROCESSING
})
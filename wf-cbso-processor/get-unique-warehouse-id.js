const fs = require('fs')

fs.readFile('./data-test-kit/orderlines.json', 'utf8', (error, data) =>{
    if(error){
        console.log("File reading", "Failed!")
        throw(error)
    }
    const orderLines = JSON.parse(data);
    
    //START PROCESSING
    let warehouseIds = []
    let productApns = []
    let promotions = []

    orderLines.forEach(orderLine => {
        if(orderLine.warehouseId != ""){
            warehouseIds.push(orderLine.warehouseId)
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

    console.log("warehouseIds", warehouseIds)
    console.log("productApns", productApns)
    console.log("promotions", promotions)
    //END PROCESSING
})
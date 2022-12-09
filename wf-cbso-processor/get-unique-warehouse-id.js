const fs = require('fs')

fs.readFile('./data-test-kit/orderlines.json', 'utf8', (error, data) =>{
    if(error){
        console.log("File reading", "Failed!")
        throw(error)
    }
    const orderLines = JSON.parse(data);
    
    //START PROCESSING
    let warehouseIds = []
    orderLines.forEach(orderLine => {
        if(orderLine.warehouseId != ""){
            warehouseIds.push(orderLine.warehouseId)
        }
    })
    warehouseIds = [... new Set(warehouseIds)]
    return warehouseIds
    //END PROCESSING
})
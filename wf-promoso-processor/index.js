const fs = require('fs')

const STATUS_05 = "05"
const STATUS_97 = "97"
let chargeBackOrderLines = []
let warehouseOrderLines = []

fs.readFile('./data-test-kit/orderlines.json','utf8',(error, data) =>{
    if(error){
        console.log("File reading", "Failed!")

        throw(error)
    }

    const orderLines = JSON.parse(data)
    
    //START PROCESSING
    orderLines.forEach(orderLine =>{
        //exclude the order line that status equal to 05 and 97
        if(orderLine.status !== STATUS_05 || orderLine.status !== STATUS_97){
            switch(orderLine.promSource){
                case "W":
                    warehouseOrderLines.push(orderLine)
                    break
                
                case "C":
                    chargeBackOrderLines.push(orderLine)
                    break
                
                default:
                    break
            }
        }
    })
    //END PROCESSING

    console.log("warehouseOrderLines", JSON.stringify(warehouseOrderLines))
    console.log("chargeBackOrderLines", JSON.stringify(chargeBackOrderLines))
})

const orderLines = workflowContext.actions.Parse_JSON_SO.outputs.body.orderLines || []
const STATUS_05 = "05"
const STATUS_97 = "97"
let chargeBackOrderLines = []
let warehouseOrderLines = []

orderLines.foreEach(orderLine =>{
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

return {
    chargeBackOrderLines,
    warehouseOrderLines
}
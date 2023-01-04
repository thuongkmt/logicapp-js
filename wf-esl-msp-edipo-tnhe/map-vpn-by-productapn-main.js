const orderLines = workflowContext.actions.Validate_HTTP_request_body.outputs.body.orderLines || []
const productVPN = workflowContext.actions.Look_up_products_vpn.outputs.body || []
const STATUS_REJECT = 05
let vpnData = []

orderLines.forEach(orderLine =>{
    let count = 0
    productVPN.every(element => {
        let vpnObject = {}
        if(element.productApn === orderLine.productApn && orderLine.status != STATUS_REJECT){
            vpnObject.productApn = orderLine.productApn
            vpnObject.status = orderLine.status
            vpnObject.vpn = element.vpn[0]
            vpnData.push(vpnObject)
            return false
        }
        count ++
        if(count === productVPN.length && orderLine.status != STATUS_REJECT){
            vpnObject.productApn = orderLine.productApn
            vpnObject.status = orderLine.status
            vpnObject.vpn = ""
            vpnData.push(vpnObject)
        }
        return true
    })
})
return vpnData
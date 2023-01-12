const fs = require('fs')

fs.readFile('./data-test-kit/orderlines.json', 'utf8', (error, data)=>{
    if(error) throw(error)
    let orderLines = JSON.parse(data)
    
    fs.readFile('./data-test-kit/productvpn.json', 'utf8', (error, data)=>{
        if(error) throw(error)
        let productVPN = JSON.parse(data)
        
        //START PROCESSING
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

        fs.writeFile('./data-result/vpn-data.json', JSON.stringify(vpnData), (error) =>{
            if(error) throw(error)
        })
        //END PROCESSING
    })
})
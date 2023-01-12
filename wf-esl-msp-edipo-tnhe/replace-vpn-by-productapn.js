const fs = require('fs')

fs.readFile('./data-result/vpn-data.json', 'utf8', (error, data)=>{
    if(error) throw(error)
    let vpnData = JSON.parse(data) || []
    
    fs.readFile('./data-test-kit/so-object.txt', 'utf8', (error, data)=>{
        if(error) throw(error)
        let soObject = data

        //START PROCESSING
        vpnData.forEach(vpnElem => {
            let productVpn = `{VPN}${vpnElem.productApn}`
            console.log(productVpn)

            if(vpnElem.vpn === ""){
                soObject = soObject.replace(productVpn, vpnElem.productApn)
            }
            else{
                soObject = soObject.replace(productVpn, vpnElem.vpn)
            }
        });
        //END PROCESSING

        fs.writeFile('./data-result/so-object.txt', soObject, (error) =>{
            console.log("HELLO")
            if(error) throw(error)
        })
    })
})
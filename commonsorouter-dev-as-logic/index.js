const fs = require('fs')

let orderLines = []//workflowContext.actions.ParseJSON_salesOrder.outputs.body.orderLines
let productApns = []//workflowContext.actions.Lookup_productByApns.outputs.body
let productIds = [] //workflowContext.actions.Lookup_productByIds.outputs.body

fs.readFile("./data/orderLines.json", "utf8", (err, jsonString) => {
    if (err) {
        console.log("File read failed:", err);
        return;
    }
    orderLines = JSON.parse(jsonString);
    //productIds
    fs.readFile("./data/productIds.json", "utf8", (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err);
            return;
        }
        productIds = JSON.parse(jsonString);
        //productApn
        fs.readFile("./data/productApns.json", "utf8", (err, jsonString) => {
            if (err) {
                console.log("File read failed:", err);
                return;
            }
            productApns = JSON.parse(jsonString);

            //MAIN PROCESSING
             orderLines.map(orderLine => {
                if(orderLine.stockTypeFlags == null){
                    delete orderLine.stockTypeFlags
                }
                switch(orderLine.productCodeType){
                    case "A":
                        if(productApns.length>0){
                            let productCount = 0
                            productApns.every(product =>{
                                productCount ++
                                if(product.apn === orderLine.productCode){
                                    console.log("Found-A", orderLine.productCode)
                                    orderLine.itemCode = product._id
                                    orderLine.productApn = orderLine.productCode
                                    if(orderLine.productDescription === ""){
                                        orderLine.productDescription = product.name
                                    }
                                    return false
                                }
                                else{
                                    if(productCount === productApns.length){
                                        console.log("Not-Found-A", orderLine.productCode)
                                        orderLine.status = "05"
                                        orderLine.statusComment = "Invalid Item"
                                    }
                                    return true
                                }
                            })
                        }
                        break
                    default: //R or W
                        if(productIds.length>0){
                            let productCount = 0
                            productIds.every(product =>{
                                productCount ++
                                if(product._id === orderLine.productCode){
                                    console.log("Found-R", orderLine.productCode)
                                    orderLine.itemCode = product._id
                                    orderLine.productApn = product.apn
                                    if(orderLine.productDescription === ""){
                                        orderLine.productDescription = product.name
                                    }
                                    return false
                                }
                                else{
                                    if(productCount === productIds.length){
                                        console.log("Not-Found-R", orderLine.productCode)
                                        orderLine.status = "05"
                                        orderLine.statusComment = "Invalid Item"
                                    }
                                    return true
                                }
                            })
                        }
                        break
                }

                return orderLine
            })
            //END PROCESSING    
            
            console.log("orderLines:", JSON.stringify(orderLines));
        })
    })
})
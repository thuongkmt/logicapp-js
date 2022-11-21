const fs = require('fs')
let products = []//workflowContext.actions.Get_products_data_from_ESL.outputs.body
let orderLines = [] //workflowContext.trigger.outputs.body.orderLines
let sourceSystem = ""//workflowContext.trigger.outputs.body.sourceSystem

fs.readFile("./data/orderLines.json", "utf8", (err, jsonString) => {
    if (err) {
        console.log("File read failed:", err);
        return;
    }
    orderLines = JSON.parse(jsonString);

    fs.readFile("./data/products.json", "utf8", (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err);
            return;
        }
        products = JSON.parse(jsonString);
        
        //START PROCESSING
        orderLines.map(orderLine => {
            //check status of orderLine
            if(orderLine.status ==="05"){
                orderLine.statusComment = "Unrecognised Product sent to Supplier"
                if(orderLine.revisedListCost ===""){
                    orderLine.revisedListCost = orderLine.costBeforeTax
                }
            }
            else{
                orderLine.status = "27"
                orderLine.statusComment = "Product Recognised and sent to Supplier"
                
                //fill the srpIncTax
                products.filter(product => {
                    if(product.apn === orderLine.productApn){
                        orderLine.srpIncTax = product.nationalRetailSrp
                    }
                    return product
                })
        
                //check if sourceSystem equal to GUS or not
                switch(sourceSystem){
                    case "GUS":
                        //totalLinesAmountAfterTax = costAfterTax * quantityOrdered
                        orderLine.totalLinesAmountAfterTax = (orderLine.costAfterTax * orderLine.quantityOrdered).toFixed(2)
                        orderLine.revisedListCost = orderLine.costBeforeTax
                        break
                    default:
                        //select the Break where quantityOrdered ≥ eligibleQuantity, and the eligibleQuantity is the biggest qualified value
                        //order the array desc
                        products.filter(product => {
                            if(product.apn === orderLine.productApn){
                                let productCostBreaks = product.productCost.suppliers.ProductCostBreaks[0]
                                let productCostBreaksOrdered = []
                                for(let i=1; i<=Object.keys(productCostBreaks).length; i++){
                                    productCostBreaksOrdered.push(productCostBreaks[`Break${i}`])
                                }
                                productCostBreaksOrdered.sort(function(a, b){return b.eligibleQuantity - a.eligibleQuantity});
                                
                                productCostBreaksOrdered.every(productCostBreak => {
                                    if(orderLine.quantityOrdered >= productCostBreak.eligibleQuantity){
                                        orderLine.totalLinesAmountAfterTax = (productCostBreak.CostAT * orderLine.quantityOrdered).toFixed(2)
                                        orderLine.costBeforeTax = productCostBreak.costBT
                                        return false
                                    }
                                    return true
                                })
                                orderLine.revisedListCost = orderLine.costBeforeTax
                            }
                        })
                        
                        break
                } 
            }
            
            return orderLine
        });

        //console.log("orderLines", JSON.stringify(orderLines))
    });
});





const fs = require('fs')

let orderLines = []//workflowContext.actions.ParseJSON_salesOrder.outputs.body.orderLines


fs.readFile("./data/orderLines.json", "utf8", (err, jsonString) => {
    if (err) {
        console.log("File read failed:", err);
        return;
    }
    orderLines = JSON.parse(jsonString);
    let apns = []
    let ids = []
    orderLines.filter(item => {
        if(item.productCodeType === "A"){
            apns.push(item.productCode)
        }
        else{
            ids.push(item.productCode)
        }
    })
    return {
        apns: [...new Set(apns)],
        ids: [...new Set(ids)]
    }
});
const fs = require('fs')

let orderLines = [] //workflowContext.trigger.outputs.body.orderLines

fs.readFile("./data/orderLines.json", "utf8", (err, jsonString) => {
    if (err) {
        console.log("File read failed:", err);
        return;
    }
    orderLines = JSON.parse(jsonString);
    
    orderLines.map(orderLine => {
        orderLine.status = "05"
        orderLine.statusComment = "Invalid Item"
        return orderLine
    })
    console.log("orderLines", JSON.stringify(orderLines))

})
const fs = require("fs")

fs.readFile("./data-test-kit/orderLines-gus.json", "utf8",(err, data) =>{
    if(err){
        console("err reading data", err)
        return false
    }
    let orderLines = JSON.parse(data)

    if (!Array.isArray(orderLines)) return []
    let itemcodes = orderLines.map(item => item.itemCode)
    let uniqueItemcodes = [... new Set(itemcodes)]
    console.log("itemCodes", uniqueItemcodes)
    return uniqueItemcodes
})
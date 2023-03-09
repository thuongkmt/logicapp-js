const fs = require("fs")

fs.readFile("./data-test-kit/dallas-so.json", "utf8",(err, data) =>{
    if(err){
        console.log("err reading data", err)
        return false
    }
    let orders = JSON.parse(data)
    
    //Start
    if (orders.length === 0 || !Array.isArray(orders.Order)) 
    {
        console.log("orders", orders)
        return []
    }
    let skus = []
    orders.Order.map(order => {
        order.Detail.map(line => {
            skus.push(line.ProductCode)
        })
       
    })
    let uniqueSkus = [... new Set(skus)]
    console.log("skus", uniqueSkus)
    return uniqueSkus
})
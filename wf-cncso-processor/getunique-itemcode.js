///requirements
///+ itemCode must be unique
///+ status must not be "05"

const fs = require('fs')

fs.readFile("./data-test-kit/orderlines.json", "utf8", (error, data) =>{
    if(error){
        console("File reading", "is failed!")
        return false
    }
    const orderLines = JSON.parse(data)

    //START PROCESSING
    let itemCodes = []
    orderLines.forEach(element => {
        if(element.status != "05"){
            itemCodes.push(element.itemCode)
        }
    })
    itemCodes = [...new Set(itemCodes)]
    //END PROCESSING

    console.log("itemCodes", itemCodes)
})
const fs = require('fs')

const STATUS_05  = "05"
const WAREHOUSE  = "W"
const CHARGEBACK = "C"
let isPromotion = false;

fs.readFile("./data-test-kid/orderevents.json", "utf8", (error, data) =>{
    if(error){
        console.log("File reading", "Failed!")
        return false
    }
    const orderEvents = JSON.parse(data)[0]

    fs.readFile("./data-test-kid/stores.json", "utf8", (error, data) =>{
        if(error){
            console.log("File reading", "Failed!")
            return false
        }
        const stores = JSON.parse(data)[0]

        fs.readFile("./data-test-kit", "utf8", (error, data) =>{
            if(error){
                console.log("File reading", "Failed!")
                return false
            }
            const orderLines = JSON.parse(data)

            //START PROCESSING
            orderLines.map(orderLine =>{
                if(orderLine.status === STATUS_05){
                    orderLine.promSource = WAREHOUSE
                }
                else{
                    let itemLoopCount = 0
                    //check itemCode
                    orderEvents.itemLists.every(item =>{
                        itemLoopCount ++
                        if(orderLine.itemCode === item.itemID){
                            //check promSource
                            if(stores.promRegion === item.itemPromRegions.region){
                                orderLine.promSource = item.itemPromRegions.promSource
                                //check a least one item.itemPromRegions.promSource equal to promSource of W
                                switch(item.itemPromRegions.promSource){
                                    case WAREHOUSE: 
                                        isPromotion = true
                                        break

                                    case CHARGEBACK:

                                        break
                                    default: 
                                        break
                                }
                                if(item.itemPromRegions.promSource === WAREHOUSE){
                                    isPromotion = true
                                }
                            }

                            return false
                        }
                        else{
                            if(itemLoopCount === orderEvents.itemLists.length){
                                orderLine.promSource = WAREHOUSE
                            }
                        }
                        return true
                    })
                }
            })
            //END PROCESSING
        })
    })
})

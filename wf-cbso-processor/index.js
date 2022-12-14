const fs = require('fs')

let salesOrder = []
let orderEvents = []
let products = []
let suppliers = []
let stores = []
let orderEventSupplierMinOrders = []

fs.readFile('./data-test-kit/salesorder.json', 'utf8', (error, data) =>{
    if(error){
        console.log("Reading file", "Failed!")
        throw error
    }

    salesOrder = JSON.parse(data)
    fs.readFile('./data-result/orderevents.json', 'utf8', (error, data) =>{
        if(error){
            console.log("Reading file", "Failed!")
            throw error
        }
        
        orderEvents = JSON.parse(data)
        fs.readFile('./data-result/products.json', 'utf8', (error, data) =>{
            if(error){
                console.log("Reading file", "Failed!")
                throw error
            }
            
            products = JSON.parse(data)
            fs.readFile('./data-result/supplier.json', 'utf8', (error, data) =>{
                if(error){
                    console.log("Reading file", "Failed!")
                    throw error
                }

                suppliers = JSON.parse(data)
                fs.readFile('./data-result/stores.json', 'utf8', (error, data) =>{
                    if(error){
                        console.log("Reading file", "Failed!")
                        throw error
                    }
                    stores = JSON.parse(data)

                    fs.readFile('./data-result/orderevents-supplierminorder.json', 'utf8', (error, data) =>{
                        if(error){
                            console.log("Reading file", "Failed!")
                            throw error
                        }
                        orderEventSupplierMinOrders = JSON.parse(data)

                        /////////START PROCESSING/////////
                        let stagingObjectArray = []
                        
                        salesOrder.orderLines.forEach(orderLine => {
                            //initial object and mapping with out-of-the-box properties
                            let stagingObject = {
                                poNumber: salesOrder.referenceOrderId,
                                orderType: salesOrder.calculatedOrderType,
                                orderCreated: salesOrder.createdTime,
                                storeNumber: salesOrder.storeNumber,
                                promId: salesOrder.promotionId,
                                productSEQ: orderLine.lineNo === undefined ? 0 : orderLine.lineNo, 
                                upc: orderLine.productApn,
                                itemCode: orderLine.itemCode,
                                orderBTax: orderLine.costBeforeTax,
                                extendedValue: parseFloat(orderLine.totalLinesAmountAfterTax),
                                qtyOrdered: orderLine.quantityOrderedAdjusted,
                                uom: orderLine.uom,
                                inserted: new Date(new Date().toUTCString()),
                                processing: 0,
                                processedDate: "",
                                docNo: 0
                            }

                            //storeNumber processing
                            if(stores.length > 0){
                                let store = stores[0]
                                stagingObject.storeName = store.storeName
                                stagingObject.storeAdd1 = store.address.storeAddress1
                                stagingObject.storeAdd2 = store.address.storeAddress2
                                stagingObject.storeCity = store.address.storeCity
                                stagingObject.state = store.address.state
                                stagingObject.storePCode = store.address.postCode
                                stagingObject.storeBrand = store.brand
                                stagingObject.cbState = store.chargebackState
                                stagingObject.primarySupplier = orderLine.warehouseId
                            }

                            //orderLines.warehouseId processing
                            let isSupplierCount = 0
                            suppliers.every(supplier => {
                                isSupplierCount ++
                                if(orderLine.warehouseId === supplier.id){
                                    stagingObject.supName = supplier.name
                                    stagingObject.contactName = supplier.supplierContactName
                                    stagingObject.contactPhone = supplier.supplierContactPhone
                                    stagingObject.contactEmail = supplier.supplierContactEmail
                                    return false
                                }
                                if(isSupplierCount === suppliers.length){
                                    stagingObject.supName = ""
                                    stagingObject.contactName = ""
                                    stagingObject.contactPhone = ""
                                    stagingObject.contactEmail = ""
                                }
                                return true
                            })

                            //orderLines.itemCode for vpn and skuCategory
                            let productCount = 0
                            let isSkuCatFound = false
                            products.every(product => {
                                productCount ++
                                if(orderLine.itemCode === product._id){
                                    stagingObject.skuCategory = product.departmentName
                                    stagingObject.skuDesc = product.name,
                                    isSkuCatFound = true
                                    if(orderLine.warehouseId === product.supplierNo){
                                        stagingObject.vpn = product.vpn
                                        return false
                                    }
                                }
                                if(productCount === products.length){
                                    stagingObject.vpn = ""
                                    if(isSkuCatFound === false){
                                        stagingObject.skuCategory = ""
                                    }
                                }
                                return true
                            })

                            switch(salesOrder.calculatedOrderType){
                                case "Promo":
                                    //orderLines.promotion for event.eventCode 
                                    let orderEventCount = 0
                                    orderEvents.every(orderEvent => {
                                        orderEventCount ++
                                        if(orderLine.promotion === orderEvent.event.eventPromChannelStores.promCode){
                                            stagingObject.eventCode = orderEvent.event.eventCode
                                            stagingObject.eventDesc = orderEvent.event.eventDescription
                                            
                                            //agencyDeliveryStartDate
                                            let agencyDeliveryStartDateTime = orderEvent.event.agencyDeliveryStartDate === undefined ? "" : orderEvent.event.agencyDeliveryStartDate
                                            let agencyDeliveryStartDate = ""
                                            if(agencyDeliveryStartDateTime != ""){
                                                agencyDeliveryStartDate = agencyDeliveryStartDateTime.split(/[-T:]/)
                                                stagingObject.notBeforeDate = `${agencyDeliveryStartDate[0]}/${agencyDeliveryStartDate[1]}/${agencyDeliveryStartDate[2]}`
                                            }
                                            else stagingObject.notBeforeDate = ""

                                            //agencyDeliveryEndDate
                                            let agencyDeliveryEndDateTime = orderEvent.event.agencyDeliveryEndDate === undefined ? "" : orderEvent.event.agencyDeliveryEndDate
                                            let agencyDeliveryEndDate = ""
                                            if(agencyDeliveryEndDateTime  != ""){
                                                agencyDeliveryEndDate = agencyDeliveryEndDateTime.split(/[-T:]/)
                                                stagingObject.notAfterDate = `${agencyDeliveryEndDate[0]}/${agencyDeliveryEndDate[1]}/${agencyDeliveryEndDate[2]}`
                                            }
                                            else  stagingObject.notAfterDate = ""

                                            //consolidationDate convert to UTC time
                                            let consolidationDate = orderEvent.event.consolidationDate === undefined ? "" : orderEvent.event.consolidationDate
                                            let consolidationDateTime = ""
                                            if(consolidationDate!= ""){
                                                consolidationDateTime = new Date(consolidationDate).toUTCString()
                                            }
                                            stagingObject.consolidationDate = new Date(consolidationDateTime).toISOString()
                                            return false
                                        }
                                        if(orderEventCount === orderEvents.length){
                                            stagingObject.eventCode = ""
                                            stagingObject.eventDesc = ""
                                            stagingObject.notBeforeDate = ""
                                            stagingObject.notAfterDate = ""
                                            stagingObject.consolidationDate = ""
                                        }
                                        return true
                                    })

                                    //fill the supplierMinOrder 
                                    let orderEventSupplierMinOrderCount = 0
                                    orderEventSupplierMinOrders.every(orderEvent => {
                                        orderEventSupplierMinOrderCount ++
                                        if(orderLine.itemCode === orderEvent.event.itemList.itemID && orderLine.promotion === orderEvent.event.itemList.itemPromChannels.promCode.toString()){
                                            stagingObject.suppMinOrd = orderEvent.event.itemList.itemPromChannels.itemPromRegions.supplierMinOrder
                                            return false
                                        }

                                        if(orderEventSupplierMinOrderCount === orderEventSupplierMinOrders.length){
                                            stagingObject.suppMinOrd = 0
                                        }
                                        return true
                                    })
                                    break

                                default: 
                                    stagingObject.eventCode = ""
                                    stagingObject.promId = ""
                                    stagingObject.eventDesc = ""
                                    stagingObject.notBeforeDate = ""
                                    stagingObject.notAfterDate = ""
                                    stagingObject.consolidationDate = ""
                                    stagingObject.suppMinOrd = 0
                                    break
                            }


                            stagingObjectArray.push(stagingObject)
                        })
                        /////////END PROCESSING/////////

                        fs.writeFile("./data-result/index-result.json", JSON.stringify(stagingObjectArray), (error) =>{
                            if(error) throw(error)
                        })

                    })

                })
            })

        })
    
    })

})
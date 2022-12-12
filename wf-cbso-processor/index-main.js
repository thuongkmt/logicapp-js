const salesOrder = workflowContext.trigger.outputs.body || {}
const orderEvents = workflowContext.actions.Get_OrderEvents_Data.outputs.body || []
const products = workflowContext.actions.Get_Products_Data.outputs.body || []
const suppliers = workflowContext.actions.Get_Supplier_Data.outputs.body || []
const stores = workflowContext.actions.Get_Stores_Data.outputs.body || []

let stagingObjectArray = []

salesOrder.orderLines.forEach(orderLine => {
    //initial object and mapping with out-of-the-box properties
    let stagingObject = {
        poNumber: salesOrder.referenceOrderId,
        orderType: salesOrder.calculatedOrderType,
        orderCreated: salesOrder.createdTime,
        storeNumber: salesOrder.storeNumber,
        productSEQ: salesOrder.orderLines.length,
        promId: salesOrder.promotionId,
        upc: orderLine.productAPN,
        itemCode: orderLine.itemCode,
        skuDesc: orderLine.productDescription,
        orderBTax: orderLine.costBeforeTax,
        extendedValue: orderLine.totalLinesAmountAfterTax,
        qtyOrdered: orderLine.quantityOrderedAdjusted,
        uom: orderLine.uom
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
        stagingObject.storeBrand = store.chargebackState
        stagingObject.cbState = store.brand
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

    //orderLines.promotion for event.eventCode 
    let orderEventCount = 0
    orderEvents.every(orderEvent => {
        orderEventCount ++
        if(orderLine.promotion === orderEvent.event.eventPromChannelStores.promCode){
            stagingObject.eventCode = orderEvent.event.eventCode
            stagingObject.eventDesc = orderEvent.event.eventDescription
            stagingObject.notBeforeDate = orderEvent.event.agencyDeliveryStartDate === undefined ? "" : orderEvent.event.agencyDeliveryStartDate
            stagingObject.notAfterDate = orderEvent.event.agencyDeliveryEndDate === undefined ? "" : orderEvent.event.agencyDeliveryEndDate
            stagingObject.consolidationDate = orderEvent.event.consolidationDate === undefined ? "" : orderEvent.event.consolidationDate
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

    stagingObjectArray.push(stagingObject)
})

return stagingObjectArray
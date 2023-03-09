let orders = workflowContext.actions.HTTP_Transformation_Xml_To_Json_For_DallasSO.outputs.body || []

if (orders.length === 0 || !Array.isArray(orders.Order)) return []
let skus = []
orders.Order.map(order => {
    order.Detail.map(line => {
        skus.push(line.ProductCode)
    })
})
let uniqueSkus = [... new Set(skus)]
return uniqueSkus
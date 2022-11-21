let orderLines = workflowContext.trigger.outputs.body.orderLines

if (!Array.isArray(orderLines)) return []
let apns = orderLines.map(item => item.productApn);
let uniqueApns = [...new Set(apns)];

return uniqueApns;
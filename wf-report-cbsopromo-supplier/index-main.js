const reportData = workflowContext.actions.Current_Report_Data.outputs
const reportSummaryData = workflowContext.actions.Get_Data_For_Summary_Report.outputs.body[0] || []
const docNo = workflowContext.actions.Get_Latest_Sequence_For_The_WMS.outputs.body.sequence || 0

reportData.stores.map(store => {
    return store.storeNumberGroups.map(storeNumberGroup => {
        return storeNumberGroup.poNumberGroups.map(poNumberGroup => poNumberGroup.docNo = docNo)
    })
})
let report = {
    data: {
        _id: reportData._id,
        stores: reportData.stores,
        summary: reportSummaryData.summary
    },
    headerKey: "charge-back-header",
    bodyKey: "charge-back-body"
}

return report
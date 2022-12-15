const reportData = workflowContext.actions.Current_Report_Data.outputs
const reportSummaryData = workflowContext.actions.Get_Data_For_Summary_Report.outputs.body[0] || []

let report = {
    _id: reportData._id,
    stores: reportData.stores,
    summary: reportSummaryData.summary
}

return report
const reportData = workflowContext.actions.Current_Report_Data.outputs

let report = {
    _id: reportData._id,
    primarySupplierGroups: reportData.primarySupplierGroups
}

return report
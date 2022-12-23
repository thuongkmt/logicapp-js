const reportData = workflowContext.actions.Current_Report_Data.outputs

let report = {
    data: {
        _id: reportData._id,
        primarySupplierGroups: reportData.primarySupplierGroups
    },
    headerKey: "will be added later",
    bodyKey: "will be added later"
}

return report
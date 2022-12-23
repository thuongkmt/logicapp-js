const reportingData = workflowContext.actions.Get_Data_For_Report.outputs.body || []

let ids = []
reportingData.forEach(data => {
    data.stores.forEach(store =>{
        store.storeNumberGroups.forEach(storeNumberGroup => {
            storeNumberGroup.poNumberGroups.forEach(poNumberGroup =>{
                ids.push(poNumberGroup._id)
            })
        })
    })
})

return ids
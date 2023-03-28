const storeLoad = workflowContext.actions.Query_Store_Load.outputs.body.ResultSets.Table1 || []

let connoteArray = []
let picklistArray = []
storeLoad.forEach(item => {
    if(item.connote_status === 0){
        connoteArray.push(item)
    }
    if(item.picklist_status === 0){
        picklistArray.push(item)
    }
});
return {
    connoteArray,
    picklistArray
}
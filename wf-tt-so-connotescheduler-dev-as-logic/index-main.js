const storeLoad = workflowContext.actions.Query_Store_Load.outputs.body.ResultSets.Table1 || []

let connoteArray = []
let picklistArray = []
//Split Array
storeLoad.forEach(item => {
    if(item.connote_status === 0){
        connoteArray.push(item)
    }
    if(item.picklist_status === 0){
        picklistArray.push(item)
    }
});
//Group Array

return {
    connoteArray,
    picklistArray
}
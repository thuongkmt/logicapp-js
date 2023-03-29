const picArray = workflowContext.actions.ExecScriptCode_For_Store_Load.outputs.body.picklistArray || []
let picArrGr = []
for (var i in picArray) {
    var item = picArray[i]
    var newItem = {}
    var key = `stload${item.plan_no}${item.store_no}`

    var isYes = false;
    for (var j in picArrGr) {
        if (picArrGr[j].hasOwnProperty(key)) {
            isYes = j;
        }
    }
    if (!isYes) {
        newItem[key] = {plan_no: item.plan_no, store_no: item.store_no};
        newItem[key]['list_so'] = [];
        newItem[key]['list_so'].push(item.so_no);
        picArrGr.push(newItem);
    } else {
        picArrGr[isYes][key]['list_so'].filter(so => {
            if(so != item.so_no)
            picArrGr[isYes][key]['list_so'].push(item.so_no)
        })
    }
}
const regex = /(stload[0-9]*)/ig;
let data = JSON.stringify(picArrGr).replace(regex, 'store_load')
return JSON.parse(data) || []
const conArray = workflowContext.actions.ExecScriptCode_For_Store_Load.outputs.body.connoteArray || []
let conArrGr = []
for (var i in conArray) {
    var item = conArray[i]
    var newItem = {}
    var key = `stload${item.plan_no}${item.store_no}`

    var isYes = false;
    for (var j in conArrGr) {
        if (conArrGr[j].hasOwnProperty(key)) {
            isYes = j;
        }
    }
    if (!isYes) {
        newItem[key] = {plan_no: item.plan_no, store_no: item.store_no};
        newItem[key]['list_so'] = [];
        newItem[key]['list_so'].push(item.so_no);
        conArrGr.push(newItem);
    } else {
        conArrGr[isYes][key]['list_so'].filter(so => {
            if(so != item.so_no)
            conArrGr[isYes][key]['list_so'].push(item.so_no)
        })
    }
}
const regex = /(stload[0-9]*)/ig;
let data = JSON.stringify(conArrGr).replace(regex, 'store_load')
return JSON.parse(data) || []
const { Console } = require('console')
const fs = require('fs')

fs.readFile('./data-test-kit/connote.json','utf8',(error, data) => {
    if(error) throw(error)

     conArray = JSON.parse(data)
     //console.log(conArray.length)
    //START PROCESSING

    //START MAIN
    let conArrGrp = []
    conArray.map((item, i) =>{
        var newItem = {}
        var key = `stload${item.plan_no}${item.store_no}`
        let isExistedConGrpCount = 0;
        conArrGrp.every((itemGrp, index) =>{
            isExistedConGrpCount ++
            if (itemGrp.hasOwnProperty(key)) {
                var isExistedSOCount = 0;
                conArrGrp[index][key]['list_so'].every(so => {
                    isExistedSOCount ++;
                    if(item.so_no == so)
                    {
                        return false;
                    }
                    if(isExistedSOCount == conArrGrp[index][key]['list_so'].length){
                        conArrGrp[index][key]['list_so'].push(item.so_no)
                    }
                    return true
                })
                return false;
            }
            if(isExistedConGrpCount == conArrGrp.length){
                newItem[key] = {plan_no: item.plan_no, store_no: item.store_no};
                newItem[key]['list_so'] = [];
                newItem[key]['list_so'].push(item.so_no);
                conArrGrp.push(newItem);
            }
            return true;
        })
        if(conArrGrp.length == 0){
            newItem[key] = {plan_no: item.plan_no, store_no: item.store_no};
            newItem[key]['list_so'] = [];
            newItem[key]['list_so'].push(item.so_no);
            conArrGrp.push(newItem);
        }
    })
    const regex = /(stload[0-9]*)/ig;
    let result = JSON.stringify(conArrGrp).replace(regex, 'store_load')
    //END MAIN


    //console.log(result)
})
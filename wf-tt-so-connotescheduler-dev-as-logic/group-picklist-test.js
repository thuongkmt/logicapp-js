const { Console } = require('console')
const fs = require('fs')

fs.readFile('./data-test-kit/picklist.json','utf8',(error, data) => {
    if(error) throw(error)

    picArray = JSON.parse(data)
     //console.log(conArray.length)
    //START PROCESSING

    //START MAIN
    let picArrGrp = []
    picArray.map((item, i) =>{
        var newItem = {}
        var key = `stload${item.plan_no}${item.store_no}`
        let isExistedConGrpCount = 0;
        picArrGrp.every((itemGrp, index) =>{
            isExistedConGrpCount ++
            if (itemGrp.hasOwnProperty(key)) {
                var isExistedSOCount = 0;
                picArrGrp[index][key]['list_so'].every(so => {
                    isExistedSOCount ++;
                    if(item.so_no == so)
                    {
                        return false;
                    }
                    if(isExistedSOCount == picArrGrp[index][key]['list_so'].length){
                        picArrGrp[index][key]['list_so'].push(item.so_no)
                    }
                    return true
                })
                return false;
            }
            if(isExistedConGrpCount == picArrGrp.length){
                newItem[key] = {plan_no: item.plan_no, store_no: item.store_no, warehouse: item.warehouse};
                newItem[key]['list_so'] = [];
                newItem[key]['list_so'].push(item.so_no);
                picArrGrp.push(newItem);
            }
            return true;
        })
        if(picArrGrp.length == 0){
            newItem[key] = {plan_no: item.plan_no, store_no: item.store_no, warehouse: item.warehouse};
            newItem[key]['list_so'] = [];
            newItem[key]['list_so'].push(item.so_no);
            picArrGrp.push(newItem);
        }
    })
    const regex = /(stload[0-9]*)/ig;
    let result = JSON.stringify(picArrGrp).replace(regex, 'store_load')
    //END MAIN


    console.log(result)
})
const fs = require('fs')


let connoteArray = []
let picklistArray = []
fs.readFile('./data-test-kit/store-load.json','utf8',(error, data) => {
    if(error) throw(error)

    storeLoad = JSON.parse(data)
    //START PROCESSING
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
   
    let pdata=[]
    for(key in connoteArray) 
    {
        let resultarr=connoteArray[key]
        let pkey = connoteArray[key].plan_no+'-'+ connoteArray[key].store_no;
        let obj = {};
        let isNew = true;
        if(pdata.length > 0){
            for(let j=0;j<pdata.length;j++){
                if(pdata[j].hasOwnProperty(pkey)){
                    pdata[j][pkey][pdata[j][pkey].length] = resultarr;
                    isNew = false;
                    break;
                }
            }
        }
        if(isNew){
            obj[pkey] = new Array();
            obj[pkey][0] = resultarr;
            pdata.push(obj);
        }
    }

    console.log("connoteArray", JSON.stringify(pdata))
    console.log("picklistArray", picklistArray)
})
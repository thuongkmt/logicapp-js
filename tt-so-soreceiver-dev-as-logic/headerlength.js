const fs = require("fs")

fs.readFile("./data-test-kit/headerlength.json", "utf8",(err, data) =>{
    if(err){
        console.log("err reading data", err)
        return false
    }
    let tmsDataArr = JSON.parse(data)
    
    //START
    let melbourne_datetime = "ddMMyyyyHH:mm:ss";
    let melbourne_date = "ddMMyyyy";
    const START_PALLET_CODE_POS = 35
    const START_PALLET_TYPE_POS = 37
    const START_PALLET_LOAD_DATE_POS = 45
    const START_TRANSACTION_DATE_POS = 61
    if (tmsDataArr.length === 0 || !Array.isArray(tmsDataArr)) 
    {
        return []
    }
    let tmsDataStandard = []
    tmsDataArr.map(tms => {
        if(tms.includes('HEADER')){
            if(tms.length == 78){
                tms = tms.substring(0, START_PALLET_CODE_POS) + "C " + tms.substring(START_PALLET_CODE_POS, tms.length)//add default pallet  code
                tms = tms.substring(0, START_PALLET_TYPE_POS) + "Pallet  " + tms.substring(START_PALLET_TYPE_POS, tms.length) //add default pallet-type
                tms = tms.substring(0, START_PALLET_LOAD_DATE_POS) + melbourne_datetime + tms.substring(START_PALLET_LOAD_DATE_POS, tms.length)//add default date time
                tms = tms.substring(0, START_TRANSACTION_DATE_POS) + melbourne_date + tms.substring(START_TRANSACTION_DATE_POS, tms.length) //add default date time
                tms = tms.substring(0, (START_TRANSACTION_DATE_POS )) + tms.substring((START_TRANSACTION_DATE_POS  + 26), tms.length)// REMOVE 26 charaters
                tms = tms.substring(0,tms.length-1) + "1";
                tmsDataStandard.push(tms)
            }
            else{
                tmsDataStandard.push(tms)
            }
            
        }else{
            tmsDataStandard.push(tms)
        }
    })
    console.log(tmsDataStandard)
    //END
})
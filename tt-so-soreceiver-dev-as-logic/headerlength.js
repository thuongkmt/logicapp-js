const fs = require("fs")

fs.readFile("./data-test-kit/headerlength.json", "utf8",(err, data) =>{
    if(err){
        console.log("err reading data", err)
        return false
    }
    let tmsData = JSON.parse(data)
    
    //Start
    if (tmsData.length === 0 || !Array.isArray(tmsData)) 
    {
        console.log("orders", orders)
        return []
    }
    let tmsDataStandard = []
     tmsData.map(tms => {
        if(tms.includes('HEADER')){
            tmsDataStandard.push(tms)
        }
        
       
    })

    console.log(tmsDataStandard)
})
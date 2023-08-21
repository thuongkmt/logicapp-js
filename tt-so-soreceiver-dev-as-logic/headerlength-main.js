let tmArr = workflowContext.actions.Split_TMS_To_Array.outputs
let mel_dt = "ddMMyyyyHH:mm:ss";
let mel_d = "ddMMyyyy";

if (tmArr.length === 0 || !Array.isArray(tmArr)) 
    return [];
let tmsR = [];
tmArr.map(tms => {
    if(tms.includes('HEADER')){
        if(tms.length == 78){
            tms = tms.substring(0, 35) + "C " + tms.substring(35, tms.length);
            tms = tms.substring(0, 37) + "Pallet  " + tms.substring(37, tms.length);
            tms = tms.substring(0, 45) + mel_dt + tms.substring(45, tms.length);
            tms = tms.substring(0, 61) + mel_d + tms.substring(61, tms.length);
            tms = tms.substring(0, (61 + mel_d.length)) + tms.substring((61 + mel_dt.length + 26), tms.length);
            tms = tms.substring(0,tms.length-1) + "1";
            tmsR.push(tms);
        }else
        tmsR.push(tms);
        
    }else
    tmsR.push(tms);
})
return tmsR;
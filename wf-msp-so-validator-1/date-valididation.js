let requiredDate = "2022-10-16" //workflowContext.trigger.outputs.body.requiredDate
let notAfterDate = "2022-10-17" //workflowContext.trigger.outputs.body.notAfterDate


let currentDateTime = new Date()
let currentDateTimeISO = currentDateTime.toISOString()
let currentDate = currentDateTimeISO.split('T')[0]

requiredDateTimestamp = isNaN(Date.parse(requiredDate)) == true ? 0 : Date.parse(requiredDate)
notAfterDateTimestamp = isNaN(Date.parse(notAfterDate)) == true ? 0 : Date.parse(notAfterDate)
currentDateTimestamp  = Date.parse(currentDate)

//If input is blank OR date is before current date -> override with current date
if(requiredDate === "" || requiredDateTimestamp < currentDateTimestamp){
    requiredDate = currentDate
    requiredDateTimestamp = isNaN(Date.parse(requiredDate)) == true ? 0 : Date.parse(requiredDate)
}
//If input is blank OR date is before current date or the date in requiredDate -> override with requiredDate + 3 days
if(notAfterDate === "" || notAfterDateTimestamp < requiredDateTimestamp || notAfterDateTimestamp === requiredDateTimestamp){
    let requiredDateTime = new Date(requiredDate)
    let date = requiredDateTime.setDate(requiredDateTime.getDate() + 3)
    notAfterDate = new Date(date).toISOString().split('T')[0]
}
console.log("date", `${requiredDate} -${notAfterDate}`)
return {
    requiredDate,
    notAfterDate
}
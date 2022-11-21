const fs = require('fs')

const promotionId = "PL910" //workflowContext.trigger.outputs.body.promotionId
const storeNumber = "784229" //workflowContext.trigger.outputs.body.storeNumber
const isYes = "Y"

fs.readFile("../data-test-kit/event.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
    const events = JSON.parse(jsonString);

    //Start processing
    var newEvents = events.map(event => { 
        event.eventPromChannelStores = event.eventPromChannelStores.filter(el=> el.orderSubmitPromID == promotionId)
        if(event.eventPromChannelStores.length > 0){
            event.eventPromChannelStores.map(epcs => {
                epcs.storeList = epcs.storeList.filter(el => el.storeID == storeNumber && el.visible == isYes)
                if(epcs.storeList.length > 0){
                    return epcs
                }
            })
            return event
        }
    }).map(ev => {
        ev.eventPromChannelStores = ev.eventPromChannelStores.filter(el => el.storeList.length > 0)
        return ev
    }).filter(el => el.eventPromChannelStores.length > 0)
    //End processing


    //LOG-SESSION
    console.log("newEvent.length: ", newEvents.length)
    newEvents.forEach(ev => {
        console.log("events.eventPromChannelStores: ", ev.eventPromChannelStores.length)
        console.log("events.eventPromChannelStores: ", JSON.stringify(ev.eventPromChannelStores))
    })
    
    //write the data to file
    fs.writeFile("event-result.json", JSON.stringify(newEvents), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 

})
const fs = require('fs')

fs.readFile("../data-test-kit/event.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
    events = JSON.parse(jsonString);
    var newEvents = events.map(event => { 
        event.eventPromChannelStores = event.eventPromChannelStores.filter(el=> el.orderSubmitPromID==="PL910")//workflowContext.trigger.outputs.body.promotionId
        if(event.eventPromChannelStores.length > 0){
            event.eventPromChannelStores.map(epcs => {
                epcs.storeList = epcs.storeList.filter(el => el.storeID ==="784229" && el.myChannel ==="Y")//workflowContext.trigger.outputs.body.storeNumber 
                if(epcs.storeList.length > 0){
                    return epcs.storeList
                }
            })
            return event
        }
    }).map(ev => {
        ev.eventPromChannelStores = ev.eventPromChannelStores.filter(el => el.storeList.length > 0)
        return ev
    }).filter(el => el.eventPromChannelStores.length > 0)

    //get the eventPromChannelStores that has storeList
    // events.map(ev => {
    //     ev.eventPromChannelStores = ev.eventPromChannelStores.filter(el => el.storeList.length > 0)
    //     return ev
    // })
    
    //get the event that has eventPromChannelStores
    // const newEvents = events.filter(el => el.eventPromChannelStores.length > 0)

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
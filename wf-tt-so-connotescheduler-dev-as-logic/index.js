const fs = require('fs')


let connoteArray = []
let picklistArray = []
fs.readFile('./data-test-kit/store-load.json','utf8',(error, data) => {
    if(error) throw(error)

    storeLoad = JSON.parse(data)
    //START PROCESSING
    storeLoad.forEach(item => {
        if(item.connote_status === 0){
            connoteArray.push(item)
        }
        if(item.picklist_status === 0){
            picklistArray.push(item)
        }
    });

    console.log("connoteArray", connoteArray)
    console.log("picklistArray", picklistArray)
})
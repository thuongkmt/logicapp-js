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
    var connoteArrayGroup = [];
	for (var i in connoteArray) {
		var connoteItem = connoteArray[i]
		var newConnoteItem = {}
        var currentKey = `storeload${connoteItem.plan_no}${connoteItem.store_no}`

		var foundItem = false;
		for (var j in connoteArrayGroup) {
			if (connoteArrayGroup[j].hasOwnProperty(currentKey)) {
				foundItem = j;
			}
		}

		if (!foundItem) {
			newConnoteItem[currentKey] = {plan_no: connoteItem.plan_no, store_no: connoteItem.store_no};
			newConnoteItem[currentKey]['list_so'] = [];
			newConnoteItem[currentKey]['list_so'].push(connoteItem.so_no);
			connoteArrayGroup.push(newConnoteItem);
		} else {
			connoteArrayGroup[foundItem][currentKey]['list_so'].filter(so => {
                if(so != connoteItem.so_no)
                connoteArrayGroup[foundItem][currentKey]['list_so'].push(connoteItem.so_no)
            })
		}
	}

    //Replace object property for currentKey
    const regex = /(storeload[0-9]*)/ig;
    var data = JSON.stringify(connoteArrayGroup).replaceAll(regex, 'store_load')

    //Logging
    console.log("connoteArrayGroup", JSON.stringify(JSON.parse(data)))
    console.log("picklistArray", picklistArray)
})
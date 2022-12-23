const fs = require('fs')

fs.readFile('./data-test-kit/current-cnc-supplier.json', 'utf8', (error, data) => {
    if(error) throw(error)

    const reportingData = JSON.parse(data);

    //START PROCESSING
    let ids = []
    reportingData.stores.forEach(store =>{
        store.storeNumberGroups.forEach(storeNumberGroup => {
            storeNumberGroup.poNumberGroups.forEach(poNumberGroup =>{
                ids.push(poNumberGroup._id)
            })
        })
    })
    //END PROCESSING

    console.log("ids", ids)
})
const fs = require('fs')

let reportData = []
let reportSummaryData = []
const docNo = 10000418

fs.readFile('./data-test-kit/current-cnc-supplier.json','utf8',(error, data) => {
    if(error) throw(error)

    reportData = JSON.parse(data)
    fs.readFile('./data-test-kit/cnc-supplier-summary.json','utf8',(error, data) => {
        if(error) throw(error)
        
        reportSummaryData = JSON.parse(data)[0]

        //START PROCESSING
        reportData.stores.map(store => {
            return store.storeNumberGroups.map(storeNumberGroup => {
                return storeNumberGroup.poNumberGroups.map(poNumberGroup => poNumberGroup.docNo = docNo)
            })
        })
        let report = {
            data: {
                _id: reportData._id,
                stores: reportData.stores,
                summary: reportSummaryData.summary
            },
            headerKey: "charge-back-header",
            bodyKey: "charge-back-body"
        }

        //END PROCESSING

        fs.writeFile('./data-result/cnc-report.json', JSON.stringify(report),(error) => {
            if(error) throw(error)
        })
    })
})
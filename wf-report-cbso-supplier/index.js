const fs = require('fs')

let reportData = []
let reportSummaryData = []

fs.readFile('./data-test-kit/current-cnc-supplier.json','utf8',(error, data) => {
    if(error) throw(error)

    reportData = JSON.parse(data)
    fs.readFile('./data-test-kit/cnc-supplier-summary.json','utf8',(error, data) => {
        if(error) throw(error)
        
        reportSummaryData = JSON.parse(data)[0]

        //START PROCESSING
        let report = {
            _id: reportData._id,
            stores: reportData.stores,
            summary: reportSummaryData.summary
        }
        //END PROCESSING

        fs.writeFile('./data-result/cnc-report.json', JSON.stringify(report),(error) => {
            if(error) throw(error)
        })
    })
})
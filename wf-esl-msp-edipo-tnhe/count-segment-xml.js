const fs = require('fs')
const DOMParser = require('xmldom').DOMParser;

fs.readFile('./data-test-kit/editnhe-result.txt', 'utf8', (error, data) => {
    if(error){
        console.log("Can not read data from file")
        return false;
    }

    parser = new DOMParser();
    xmlDoc = parser.parseFromString(data,"text/xml");
    x = xmlDoc.documentElement.childNodes
    //console.log("xml_data", x.firstChild)
    for(let i = 0; i< x.length; i++){
        console.log("xml_data", x[i].nodeName)
    }
})

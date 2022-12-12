const fs = require('fs')

let orderLines = []
let orderEvents = []
let products = []
let supplier = []
let stores = []

fs.readFile('./data-test-kit/orderlines.json', 'utf8', (error, data) =>{
    if(error){
        console.log("Reading file", "Failed!")
        throw error
    }

    orderLines = JSON.parse(data)
    fs.readFile('./data-result/orderevents.json', 'utf8', (error, data) =>{
        if(error){
            console.log("Reading file", "Failed!")
            throw error
        }
        
        orderEvents = JSON.parse(data)
        fs.readFile('./data-result/products.json', 'utf8', (error, data) =>{
            if(error){
                console.log("Reading file", "Failed!")
                throw error
            }
            
            products = JSON.parse(data)
            fs.readFile('./data-result/supplier.json', 'utf8', (error, data) =>{
                if(error){
                    console.log("Reading file", "Failed!")
                    throw error
                }

                supplier = JSON.parse(data)
                fs.readFile('./data-result/stores.json', 'utf8', (error, data) =>{
                    if(error){
                        console.log("Reading file", "Failed!")
                        throw error
                    }

                    /////////START PROCESSING/////////
                    stores = JSON.parse(data)
    
                    /////////END PROCESSING/////////
                })
            })

        })
    
    })

})
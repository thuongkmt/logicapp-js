{
    "if": {
        "properties": {
            "sourceSystem": {
                "const": "GUS"
            }
        }
    },
    "properties": {
        "mspSupplierNumber": {
            "type": "string"
        },
        "notAfterDate": {
            "oneOf": [
                {
                    "format": "date-time",
                    "type": "string"
                },
                {
                    "format": "date",
                    "type": "string"
                },
                {
                    "maxLength": 0,
                    "type": "string"
                }
            ]
        },
        "orderLines": {
            "items": {
                "properties": {
                    "costBeforeTax": {
                        "type": "number"
                    },
                    "productApn": {
                        "type": "string"
                    },
                    "productDescription": {
                        "type": "string"
                    },
                    "quantityOrdered": {
                        "type": "integer"
                    }
                },
                "required": [
                    "quantityOrdered",
                    "productDescription",
                    "productApn"
                ],
                "type": "object"
            },
            "type": "array"
        },
        "referenceOrderId": {
            "type": "string"
        },
        "requiredDate": {
            "oneOf": [
                {
                    "format": "date-time",
                    "type": "string"
                },
                {
                    "format": "date",
                    "type": "string"
                },
                {
                    "maxLength": 0,
                    "type": "string"
                }
            ]
        },
        "sourceSystem": {
            "enum": [
                "POS",
                "GUS"
            ]
        },
        "storeNumber": {
            "type": "string"
        },
        "targetBackend": {
            "type": "string"
        }
    },
    "then": {
        "properties": {
            "orderLines": {
                "items": {
                    "required": [
                        "costBeforeTax"
                    ]
                }
            }
        }
    },
    "type": "object"
}
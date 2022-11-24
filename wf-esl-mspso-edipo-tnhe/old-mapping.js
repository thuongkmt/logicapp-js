let targetJSON = {};
let supplierGLNInfo = workflowContext.actions.Look_up_supplier_globalLocationNumber.outputs.body.find(x => x.mspSupplierNumber == workflowContext.trigger.outputs.body.mspSupplierNumber) || {globalLocationNumber:""};
let supplierGLN = supplierGLNInfo.globalLocationNumber.substring(0, 35);
let sequence = workflowContext.actions.Get_sequence_for_the_interface.outputs.body.sequence.toString().substring(0, 14);
let orderItems = workflowContext.trigger.outputs.body.orderLines || [];
let currentTime = workflowContext.actions.Get_current_time_in_AEST_or_AEDT.outputs.body.split(/[-T:]/);
let requiredDate = workflowContext.actions.Convert_requiredDate_to_AEST_or_AEDT.outputs.body.split(/[-T:]/);
let notAfterDate = workflowContext.actions.Convert_notAfterDate_to_AEST_or_AEDT.outputs.body.split(/[-T:]/);

targetJSON.InterchangeHeader = {
    CharacterSetStandard: {
        Name: "UNOA",
        Version: 3,
    },
    SenderGLN: {
        GLN: "9377778052922",
        Postfix: "14"
    },
    ReceiverGLN: {
        GLN: supplierGLN,
        Postfix: "14"
    },
    TransmissionDate: currentTime[0].slice(2) + currentTime[1] + currentTime[2] + ":" + currentTime[3] + currentTime[4],
    InterchangeID: sequence
};

targetJSON.MessageHeader = {
    Version: sequence,
    MessageType: {
        Identifier: "ORDERS",
        VersionNumber: "D",
        ReleaseNumber: "96A",
        ControllingAgency: "UN",
        AssociationAssignedCode: "EAN008"
    }
};

targetJSON.BeginningOfMessage = {
    MessageNameCoded: "220",
    PONumber: workflowContext.trigger.outputs.body.referenceOrderId.substring(0, 35),
    MessageFunctionCoded: "9"
};

targetJSON.DateTimePeriod = [
    {
        Value: {
            Qualifier: "137",
            DTP: currentTime[0] + currentTime[1] + currentTime[2],
            FormatQualifier: "102"
        }
    },
    {
        Value: {
            Qualifier: "37",
            DTP: requiredDate[0] + requiredDate[1] + requiredDate[2],
            FormatQualifier: "102"
        }
    },
    {
        Value: {
            Qualifier: "43E",
            DTP: notAfterDate[0] + notAfterDate[1] + notAfterDate[2],
            FormatQualifier: "102"
        }
    }
];

targetJSON.FreeText = {
    TextSubjectQualifier: "",
    TextFunctionCoded: "",
    TextReference: "",
    TextLiternal: ""
};

targetJSON.NameAndAddress = [
    {
        PartyQualifier: "BY",
        PartyIDDetail: {
            PartyID: "9377778052922",
            Qualifier: "",
            ResponsibleAgencyCoded: "9"
        }
    },
    {
        PartyQualifier: "ST",
        PartyIDDetail: {
            PartyID: workflowContext.trigger.outputs.body.storeNumber.substring(0, 35),
            Qualifier: "",
            ResponsibleAgencyCoded: "92"
        }
    },
    {
        PartyQualifier: "SU",
        PartyIDDetail: {
            PartyID: workflowContext.trigger.outputs.body.mspSupplierNumber.substring(0, 35),
            Qualifier: "",
            ResponsibleAgencyCoded: "92"
        }
    }
];

targetJSON.LineItems = [];

targetJSON.SectionControl = {
    Identifier: "S"
};

targetJSON.ControlTotal = {
    Detail: {
        Qualifier: "2",
        Value: orderItems.length
    }
};

targetJSON.MessageTrailer = {
    NoOfSegmentInMessage: -2,
    MessageRefNumber: sequence
};

targetJSON.InterchangeTrailer = {
    ControlCount: 1,
    InterchangeID: sequence
};

// Generate LineItems elements
orderItems.forEach((item, index) => {
    let vpnInfo = workflowContext.actions.Look_up_products_vpn.outputs.body.find(x => x.productApn === item.productApn) || {vpn:[]};
    let vpn = vpnInfo.vpn.length && vpnInfo.vpn[0].substring(0, 35) || "";
    let priceInfo = workflowContext.actions.Compose_expectedCostPrices.outputs.find(x => x.productApn === item.productApn) || {expectedCostPrice:0};
    let expectedCostPrice = priceInfo.expectedCostPrice;
    let descriptions = item.productDescription.match(/.{1,35}/g) || [""];

    targetJSON.LineItems.push({
        LineItem: {
            ItemNumber: ++index,
            ActionNotificationCoded: "",
            ItemNumberIdentification: {
                ItemNumber: item.productApn.substring(0, 35),
                ItemNumberTypeCoded: "EN"
            }
        },
        AdditionalProductID: {
            FunctionQualifier: "1",
            ItemNumberIdentification: {
                ItemNumber: vpn,
                ItemNumberTypeCoded: "SA"
            }
        },
        ItemDescription: {
            DescriptionTypeCoded: "",
            CharacteristicTypeCoded: "",
            Description: {
                Identification: "",
                Qualifier: "",
                ResponsibleAgencyCoded: "",
                DescriptionR: descriptions[0],
                DescriptionO: descriptions.shift() == null || descriptions
            }
        },
        Quantity: {
            Detail: {
                Identifier: "21",
                Quantity: item.quantityOrdered
            }
        },
        PriceDetails: {
            Detail: {
                Qualifier: "AAA",
                Price: expectedCostPrice
            }
        }
    });
});

// Calculate NoOfSegmentInMessage
for (let property in targetJSON) {
    if (Array.isArray(targetJSON[property])) {
		if (property !== "LineItems") {
			targetJSON.MessageTrailer.NoOfSegmentInMessage += targetJSON[property].length;
		} else {
			targetJSON.MessageTrailer.NoOfSegmentInMessage += 5*targetJSON[property].length;
		}
    } else {
        targetJSON.MessageTrailer.NoOfSegmentInMessage += 1;
    }
}

return { Root: targetJSON };
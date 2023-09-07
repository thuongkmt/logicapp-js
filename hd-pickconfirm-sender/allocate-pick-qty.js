var so = [
    {
      "so_no": "559129",
      "store_no": "451526",
      "suffix_tran": "0",
      "sku": "6093025",
      "picked_qty": 0,
      "line_no": "1"
    }
  ];
var hd = [
    {
      "id": 3,
      "so_no": "559129",
      "sku": "6093025",
      "item_no": "1",
      "sku_desc": "Panel Easylap Fibre Cement 3600x1200x8.5mm 404980 JH",
      "original_line_no": "100",
      "combined_line_no": "1",
      "ordered_qty": 1,
      "picked_qty": null,
      "created_date": "2023-08-22T08:26:12.547"
    },
    {
      "id": 4,
      "so_no": "559129",
      "sku": "6093025",
      "item_no": "1",
      "sku_desc": "Panel Easylap Fibre Cement 3600x1200x8.5mm 404980 JH",
      "original_line_no": "100",
      "combined_line_no": "1",
      "ordered_qty": 1,
      "picked_qty": null,
      "created_date": "2023-08-22T08:45:44.05"
    },
    {
      "id": 5,
      "so_no": "559129",
      "sku": "6093025",
      "item_no": "1",
      "sku_desc": "Panel Easylap Fibre Cement 3600x1200x8.5mm 404980 JH",
      "original_line_no": "100",
      "combined_line_no": "1",
      "ordered_qty": 1,
      "picked_qty": null,
      "created_date": "2023-08-22T08:56:48.95"
    },
    {
      "id": 6,
      "so_no": "559129",
      "sku": "6093025",
      "item_no": "1",
      "sku_desc": "Panel Easylap Fibre Cement 3600x1200x8.5mm 404980 JH",
      "original_line_no": "100",
      "combined_line_no": "1",
      "ordered_qty": 1,
      "picked_qty": null,
      "created_date": "2023-08-22T10:11:49.563"
    },
    {
      "id": 7,
      "so_no": "559129",
      "sku": "6093025",
      "item_no": "1",
      "sku_desc": "Panel Easylap Fibre Cement 3600x1200x8.5mm 404980 JH",
      "original_line_no": "100",
      "combined_line_no": "1",
      "ordered_qty": 1,
      "picked_qty": null,
      "created_date": "2023-08-22T10:18:19.77"
    },
    {
      "id": 8,
      "so_no": "559129",
      "sku": "6093025",
      "item_no": "1",
      "sku_desc": "Panel Easylap Fibre Cement 3600x1200x8.5mm 404980 JH",
      "original_line_no": "100",
      "combined_line_no": "1",
      "ordered_qty": 1,
      "picked_qty": null,
      "created_date": "2023-08-23T04:06:48.64"
    },
    {
      "id": 9,
      "so_no": "559129",
      "sku": "6093025",
      "item_no": "1",
      "sku_desc": "Panel Easylap Fibre Cement 3600x1200x8.5mm 404980 JH",
      "original_line_no": "100",
      "combined_line_no": "1",
      "ordered_qty": 1,
      "picked_qty": null,
      "created_date": "2023-08-23T08:50:17.85"
    },
    {
      "id": 10,
      "so_no": "559129",
      "sku": "6093025",
      "item_no": "1",
      "sku_desc": "Panel Easylap Fibre Cement 3600x1200x8.5mm 404980 JH",
      "original_line_no": "100",
      "combined_line_no": "1",
      "ordered_qty": 1,
      "picked_qty": null,
      "created_date": "2023-08-31T03:09:56.693"
    },
    {
      "id": 11,
      "so_no": "559129",
      "sku": "6093025",
      "item_no": "1",
      "sku_desc": "Panel Easylap Fibre Cement 3600x1200x8.5mm 404980 JH",
      "original_line_no": "100",
      "combined_line_no": "1",
      "ordered_qty": 1,
      "picked_qty": null,
      "created_date": "2023-08-31T03:18:30.373"
    }
  ];
var data = []
for (var i = 0; i < so.length; i++) {
    var mat = []
    for (var j = 0; j < hd.length; j++) {
        if (so[i].so_no == hd[j].so_no && so[i].sku == hd[j].sku) {
            console.log(so[i].so_no);
            hd[j].store_no = so[i].store_no
            hd[j].suffixTran = so[i].suffixTran
            mat.push(hd[j])
        }
    }
    if (mat.length > 0) {
        mat.sort((a, b) => a.original_line_no - b.original_line_no);
        for (var k = 0; k < mat.length; k++) {
            if (so[i].picked_qty < mat[k].ordered_qty) {
                if (so[i].picked_qty == 0)
                    mat[k].picked_qty = 0
                else {
                    mat[k].picked_qty = so[i].picked_qty
                    so[i].picked_qty = 0
                }
            }
            if (so[i].picked_qty >= mat[k].ordered_qty) {
                mat[k].picked_qty = mat[k].ordered_qty
                so[i].picked_qty -= mat[k].picked_qty
            }
        } data.push(mat)
    }
}
var resultData = [
    [
      {
        "id": 3,
        "so_no": "559129",
        "sku": "6093025",
        "item_no": "1",
        "sku_desc": "Panel Easylap Fibre Cement 3600x1200x8.5mm 404980 JH",
        "original_line_no": "100",
        "combined_line_no": "1",
        "ordered_qty": 1,
        "picked_qty": 0,
        "created_date": "2023-08-22T08:26:12.547",
        "store_no": "451526"
      },
      {
        "id": 4,
        "so_no": "559129",
        "sku": "6093025",
        "item_no": "1",
        "sku_desc": "Panel Easylap Fibre Cement 3600x1200x8.5mm 404980 JH",
        "original_line_no": "100",
        "combined_line_no": "1",
        "ordered_qty": 1,
        "picked_qty": 0,
        "created_date": "2023-08-22T08:45:44.05",
        "store_no": "451526"
      },
      {
        "id": 5,
        "so_no": "559129",
        "sku": "6093025",
        "item_no": "1",
        "sku_desc": "Panel Easylap Fibre Cement 3600x1200x8.5mm 404980 JH",
        "original_line_no": "100",
        "combined_line_no": "1",
        "ordered_qty": 1,
        "picked_qty": 0,
        "created_date": "2023-08-22T08:56:48.95",
        "store_no": "451526"
      },
      {
        "id": 6,
        "so_no": "559129",
        "sku": "6093025",
        "item_no": "1",
        "sku_desc": "Panel Easylap Fibre Cement 3600x1200x8.5mm 404980 JH",
        "original_line_no": "100",
        "combined_line_no": "1",
        "ordered_qty": 1,
        "picked_qty": 0,
        "created_date": "2023-08-22T10:11:49.563",
        "store_no": "451526"
      },
      {
        "id": 7,
        "so_no": "559129",
        "sku": "6093025",
        "item_no": "1",
        "sku_desc": "Panel Easylap Fibre Cement 3600x1200x8.5mm 404980 JH",
        "original_line_no": "100",
        "combined_line_no": "1",
        "ordered_qty": 1,
        "picked_qty": 0,
        "created_date": "2023-08-22T10:18:19.77",
        "store_no": "451526"
      },
      {
        "id": 8,
        "so_no": "559129",
        "sku": "6093025",
        "item_no": "1",
        "sku_desc": "Panel Easylap Fibre Cement 3600x1200x8.5mm 404980 JH",
        "original_line_no": "100",
        "combined_line_no": "1",
        "ordered_qty": 1,
        "picked_qty": 0,
        "created_date": "2023-08-23T04:06:48.64",
        "store_no": "451526"
      },
      {
        "id": 9,
        "so_no": "559129",
        "sku": "6093025",
        "item_no": "1",
        "sku_desc": "Panel Easylap Fibre Cement 3600x1200x8.5mm 404980 JH",
        "original_line_no": "100",
        "combined_line_no": "1",
        "ordered_qty": 1,
        "picked_qty": 0,
        "created_date": "2023-08-23T08:50:17.85",
        "store_no": "451526"
      },
      {
        "id": 10,
        "so_no": "559129",
        "sku": "6093025",
        "item_no": "1",
        "sku_desc": "Panel Easylap Fibre Cement 3600x1200x8.5mm 404980 JH",
        "original_line_no": "100",
        "combined_line_no": "1",
        "ordered_qty": 1,
        "picked_qty": 0,
        "created_date": "2023-08-31T03:09:56.693",
        "store_no": "451526"
      },
      {
        "id": 11,
        "so_no": "559129",
        "sku": "6093025",
        "item_no": "1",
        "sku_desc": "Panel Easylap Fibre Cement 3600x1200x8.5mm 404980 JH",
        "original_line_no": "100",
        "combined_line_no": "1",
        "ordered_qty": 1,
        "picked_qty": 0,
        "created_date": "2023-08-31T03:18:30.373",
        "store_no": "451526"
      }
    ]
  ];

  console.log(resultData.flat());
return data
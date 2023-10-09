var so = workflowContext.actions.Compose_SO_Data.outputs
var hd = workflowContext.actions.Compose_HD_Detail.outputs
var data = []
for(var i =0;i<so.length;i++)
{
    var mat=[]
    for(var j =0;j<hd.length;j++)
    {
        if(so[i].so_no == hd[j].so_no && so[i].sku == hd[j].sku){
            hd[j].store_no=so[i].store_no
            hd[j].suffixTran=so[i].suffixTran
            mat.push(hd[j])
        }
    }
    if(mat.length>0)
    {
        mat.sort((a,b) => a.original_line_no - b.original_line_no);
        for (var k =0;k<mat.length;k++)
        {
            if(so[i].picked_qty < mat[k].ordered_qty){
                if(so[i].picked_qty == 0)
                 mat[k].picked_qty = 0
                else{
                    mat[k].picked_qty = so[i].picked_qty
                    so[i].picked_qty = 0}
                }
            if(so[i].picked_qty >= mat[k].ordered_qty){
                mat[k].picked_qty = mat[k].ordered_qty
                so[i].picked_qty -= mat[k].picked_qty
            }
        }
        data.push(mat)
    }
}

return data
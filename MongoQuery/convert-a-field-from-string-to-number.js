db.getCollection("staging").updateMany(
  { docNo : { $type: 2 } },
  [{ $set: { docNo: { $convert: { input: "$docNo", to: 16, onError: 0 } } } }]
)

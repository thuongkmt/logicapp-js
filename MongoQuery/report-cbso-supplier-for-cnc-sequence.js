db.getCollection("staging").aggregate([{ $sort: {docNo: -1}}])
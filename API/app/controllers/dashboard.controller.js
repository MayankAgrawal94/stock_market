const UserModel = require('../models/user.model');
const StockModel = require('../models/stockMstr.model');
const StockAllotModel = require('../models/stockAllot.model');
const StockLogsModel = require('../models/stockLogs.model');


exports.fetch = (req, res) => {
	// console.log(req.body)
	UserModel.findById(req.body.usr_id)
	.then(findUser=>{
		if(findUser){
			StockAllotModel.find({
				stalt_user_id: req.body.usr_id
			}).then(findAllot=>{
				if(findAllot.length > 0){
					let stockIds = findAllot.map(loop=> loop.stalt_st_id)
					StockModel.find({
						_id: {
							$in: stockIds
						}
					}).then(userStockDtl=>{
							if(userStockDtl.length > 0){
								res.status(200).send({
									error : false,
									message : "Data fetched successfully.",
									body: {
										allot: findAllot,
										stock: userStockDtl
									}
								})
							}else{
								res.status(200).send({
									error : true,
									message : "No Stocks alloted."
								})
							}
					}).catch(err=>{
						console.erroe(err)
						res.status(500).send({
							error : true,
							message : err.message || "Some error:07 occurred while retrieving the data."
						})
					})
				}else{
					res.status(200).send({
						error : true,
						message : "No Stocks alloted."
					})
				}
			}).catch(err=>{
				console.erroe(err)
				res.status(500).send({
					error : true,
					message : err.message || "Some error:08 occurred while retrieving the data."
				})
			})
		}else{
			res.status(200).send({
				error : true,
				message : "Some error:09 occurred while retrieving the data."
			})
		}
	}).catch(err=>{
			console.erroe(err)
			res.status(500).send({
				error : true,
				message : err.message || "Some error:10 occurred while retrieving the data."
			})
	})
}

exports.updatingStock = (stockId, oldRate, newRate) => {
	  let filter = { _id : stockId }
	  const update = { st_latest_rate: newRate };
	  StockModel.findOneAndUpdate(filter, update, 
	      {
	        // new: true,
	        returnNewDocument: false
	      }
	  ).then(UpdateData => {
	      if(UpdateData) {
	      	// console.log(`Stock: ${stockId} updated.`)

          let saveObj = {
            stlg_st_id: stockId,
            stlg_old_rate: oldRate,
            stlg_current_rate: newRate
          }

          // Create a User
          const stockLogs = new StockLogsModel(saveObj);

          // Save User in the database
          stockLogs.save()
          .then(data => {
              // console.log(`Error - Log for Stock: ${stockId} created.`)
          }).catch(err => {
              console.error(err)
              console.log(`Error - Log for Stock: ${stockId} not created.`)
          });

	      }else{
	      	console.log(`Error - Stock: ${stockId} not updated.`)
	      }
	  }).catch(err=>{
	  	console.error(err)
	  	console.log(`Error - Stock: ${stockId} not updated.`)
	  })
}
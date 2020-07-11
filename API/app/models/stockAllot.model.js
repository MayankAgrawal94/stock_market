const mongoose = require('mongoose');

const StockAlloctSchema = mongoose.Schema({
	stalt_user_id : {type: String, max: 36},
	stalt_st_id : {type: String, max: 36},
	stalt_qty : {type: Number, max: 99999},
	stalt_buy_rate : {type: Number, max: 99999},
}, {
    timestamps: true
});


module.exports = mongoose.model('stocks_allots', StockAlloctSchema);
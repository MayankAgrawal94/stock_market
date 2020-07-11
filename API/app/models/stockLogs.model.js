const mongoose = require('mongoose');

const StockLogSchema = mongoose.Schema({
	stlg_st_id : {type: String, max: 36},
	stlg_old_rate : {type: Number, max: 99999},
	stlg_current_rate : {type: Number, max: 99999},
}, {
    timestamps: true
});


module.exports = mongoose.model('stocks_logs', StockLogSchema);
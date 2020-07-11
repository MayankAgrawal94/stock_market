const mongoose = require('mongoose');

const StocksSchema = mongoose.Schema({
	st_name : {type: String, max: 36},
	st_qty : {type: Number, max: 999999},
	st_open_rate : {type: Number, max: 99999},
	st_latest_rate : {type: Number, max: 99999},
	st_status : {type: Boolean, default:true},
}, {
    timestamps: true
});

module.exports = mongoose.model('stocks', StocksSchema);
const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
	usr_name : {type: String, max: 36},
	usr_email : {type: String, max: 36},
	usr_password : {type: String, max: 16 ,default: null},
	usr_status : {type: Boolean, default:true},
	usr_last_login_date : {type: Number, default: 0},
}, {
    timestamps: true
});


module.exports = mongoose.model('users', UserSchema);
var jwt = require('jwt-simple');  // https://www.npmjs.com/package/jwt-simple
const secretConfig = require('../config/secret.config');
const UserModel = require('../app/models/user.model');

module.exports = {

 	authCheck : function(req, AUTH_CB){
    try{
      if(req.headers['authorization'] != undefined && req.headers['authorization'] != null && req.headers['authorization'] != ''){
        var token = req.headers['authorization']
        var decoded = jwt.decode(token, secretConfig.secret);
        

	 			UserModel.findById(decoded.user_id)
	 			.then(findUser=>{
	 				if(findUser){
	 					if(findUser.usr_last_login_date != decoded.session_time){
			 				AUTH_CB({
			 					error : true,
			 					error_code : 200,
			 					// message : "Login session expired."
			 					message : "login_expired"
			 				})
	 					}else{				
			 				AUTH_CB({
			 					error : false,
			 					body : {
			 						usr_id: decoded.user_id
			 					}
			 				})
	 					}
	 				}else{
		 				AUTH_CB({
		 					error : true,
		 					error_code : 403,
		 					// message : "Authentication failed. User not found."
		 					message : "auth_failed_user_not_found"
		 				})
	 				}
	 			}).catch(err=>{
	 				console.error(err)
	 				AUTH_CB({
	 					error : true,
	 					error_code : 500,
	 					message : "internal server error"
	 				})
	 			})

      }else{
        AUTH_CB({
        	error_code : 200,
          error: true,
          message: 'No token provided.'
        });
      }
    }catch(err){
    	console.error(err)
      AUTH_CB({
      	error_code : 200,
        error: true,
        message: 'Token provided is invalid.'
      });
    }
 	}

}
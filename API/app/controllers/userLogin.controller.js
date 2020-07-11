const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jwt-simple');  // https://www.npmjs.com/package/jwt-simple
const secretConfig = require('../../config/secret.config');


// Create and Save a new User
exports.create = (req, res) => {
    // Validate request
    if( !req.body.name && 
        !req.body.email &&
        !req.body.password) {
        return res.status(400).send({
            error : true,
            message: "Please fill the complete Sign Up form."
        });
    }

    User.findOne({
        email : req.body.email
    }).then(user => {
        if(!user){
            req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
            // Store hash in your password DB.

            let saveObj = {
              usr_name: req.body.name,
              usr_email: req.body.email,
              usr_password: req.body.password
            }

            // Create a User
            const user = new User(saveObj);

            // Save User in the database
            user.save()
            .then(data => {
                res.status(200).send({
                    error : false,
                    message : 'Sign Up successful!',
                    body : data
                });
            }).catch(err => {
                console.error(err)
                res.status(500).send({
                    error : true,
                    message: err.message || "Some error occurred while creating the User."
                });
            });
        }else{
            res.status(200).send({
                error : true,
                message : 'Email already exists!',
            });
        }
    }).catch(err => {
        console.error(err)
        res.status(500).send({
            error : true,
            message: err.message || "Some error occurred while creating the User."
        });
    })

};


// Find a single user with a email
exports.login = (req, res) => {
    User.findOne({
        usr_email : req.body.email
    }).then(user => {
        if(!user) {
            return res.status(200).send({
                message: "User not found with email : " + req.body.email
            });            
        }

        // Load hash from your password DB.
        if(bcrypt.compareSync(req.body.password, user.usr_password)){

            var loginTime = Date.now()
            var token = jwt.encode({
                user_id: user._id,
                // user_email : user.usr_email,
                // user_name : user.usr_name,
                session_time : loginTime
            }, secretConfig.secret);
            var tokenObj = {
                token : token
            }

            res.status(200).send({
                error : false,
                message : 'Login successful.',
                body : tokenObj
            });

            updateUserLoginTime( user._id, loginTime )
        }else{
            res.status(200).send({
                error : true,
                message : 'Invalid credentails!'
            });
        }
    }).catch(err => {
        console.log(err)
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with email : " + req.body.email
            });                
        }
        return res.status(500).send({
            message: "Error retrieving user with email : " + req.body.email
        });
    });
};

const updateUserLoginTime = (userID, loginTime) => {
    let filter = { _id : userID}
    let update = { usr_last_login_date : loginTime};
    User.findOneAndUpdate(filter, update, {new: true})
    .then(res=>{
        if(res){
            // console.log(' ------ > User login time successfully saved.')
        }else{
            console.log(`Error : updateUserLoginTime() -- somthing went wrong userID: ${userID}, login time could not be saved.`)
        }
    }).catch(err=>{
        console.error(err)
        console.log(" ### .. Error in saving user Login time - updateUserLoginTime()")
    })
}

exports.session = (req, res) => {
    res.status(200).send({
        error : false,
        message : 'session can cont.',
    });
}
/* more or less taken functionality from here braitsch' node-login:
 * https://github.com/braitsch/node-login/blob/master/app/server/modules/account-manager.js */

// ---- module dependencies ---------------------
var crypto 	= require('crypto');
var MongoDB = require('mongodb').Db;
var Server 	= require('mongodb').Server;
var moment 	= require('moment');

var dbPort 	= 27017;
var dbHost 	= 'localhost';
var dbName 	= 'educatopia';

// ---- module privates -------------------------
exports.isAuthorized = function(req,res) {
    if (req.cookie.user == undefined || req.cookie.pass) {
        return false;
    } else {
        AM.autoLogin(req.cookies.user, req.cookies.pass, function(o) {
            if (o != null) {
                req.session.user = o;
                return true;
            } else {
                return false;
            }
        })
    }
}

/* login validation methods */
exports.autoLogin = function(user, pass, callback) {
    userCollection.findOne({user:user}, function(e, o) {
        if (o){
            o.pass == pass ? callback(o) : callback(null);
        } else {
            callback(null);
        }
    });
}

exports.manualLogin = function(user, pass, callback) {
    userCollection.findOne({user:user}, function(e, o) {
        if (o == null){
            callback('user-not-found');
        } else {
            validatePassword(pass, o.pass, function(err, res) {
                if (res){
                    callback(null, o);
                } else {
                    callback('invalid-password');
                }
            });
        }
    });
}

// record insertion, update & deletion methods
exports.addNewAccount = function(newData, callback) {
    userCollection.findOne({user:newData.user}, function(e, o) {
        if (o){
            callback('username-taken');
        } else {
            userCollection.findOne({email:newData.email}, function(e, o) {
                if (o){
                    callback('email-taken');
                } else {
                    saltAndHash(newData.pass, function(hash){
                        newData.pass = hash;
                        // append date stamp when record was created
                        newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
                        userCollection.insert(newData, {safe: true}, callback);
                    });
                }
            });
        }
    });
}

exports.updateAccount = function(newData, callback) {
    userCollection.findOne({user:newData.user}, function(e, o){
        o.name 		= newData.name;
        o.email 	= newData.email;
        o.country 	= newData.country;

        if (newData.pass == ''){
            userCollection.save(o, {safe: true}, function(err) {
                if (err) callback(err);
                else callback(null, o);
            });
        } else {
            saltAndHash(newData.pass, function(hash){
                o.pass = hash;
                userCollection.save(o, {safe: true}, function(err) {
                    if (err) callback(err);
                    else callback(null, o);
                });
            });
        }
    });
}

exports.updatePassword = function(email, newPass, callback) {
    userCollection.findOne({email:email}, function(e, o){
        if (e){
            callback(e, null);
        } else {
            saltAndHash(newPass, function(hash){
                o.pass = hash;
                userCollection.save(o, {safe: true}, callback);
            });
        }
    });
}

exports.deleteAccount = function(id, callback) {
    userCollection.remove({_id: getObjectId(id)}, callback);
}

exports.getAccountByEmail = function(email, callback) {
    userCollection.findOne({email:email}, function(e, o){ callback(o); });
}

exports.validateResetLink = function(email, passHash, callback) {
    userCollection.find({ $and: [{email:email, pass:passHash}] }, function(e, o){
        callback(o ? 'ok' : null);
    });
}

exports.getAllRecords = function(callback) {
    userCollection.find().toArray(
            function(e, res) {
                if (e) callback(e)
                else callback(null, res)
            });
};

exports.delAllRecords = function(callback) {
    // reset userCollection collection for testing
    userCollection.remove({}, callback); 
}

// ---- establish the database connection -------
// attribute definition
var db = new MongoDB(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}), {w: 1});

db.open(function(e, d) {
    if (e) {
        console.log(e);
    } else {
        console.log('connected to educatopias database ');
    }
});

var userCollection = db.collection('users');

// ---- module-exclusive functionality ----------
var generateSalt = function() {
    var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
    var salt = '';

    for (var i = 0; i < 10; i++) {
        var p = Math.floor(Math.random() * set.length);
        salt += set[p];
    }

    return salt;
}

var md5 = function(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}

var saltAndHash = function(pass, callback) {
    var salt = generateSalt();
    callback(salt + md5(pass + salt));
}

var validatePassword = function(plainPass, hashedPass, callback) {
    var salt = hashedPass.substr(0, 10);
    var validHash = salt + md5(plainPass + salt);
    callback(null, hashedPass === validHash);
}

var getObjectId = function(id) {
    return userCollection.db.bson_serializer.ObjectID.createFromHexString(id)
}

var findById = function(id, callback) {
    userCollection.findOne({_id: getObjectId(id)},
            function(e, res) {
                if (e) callback(e)
                else callback(null, res)
            });
};

var findByMultipleFields = function(a, callback) {
    // this takes an array of name/val pairs to search against {fieldName : 'value'}
    userCollection.find( { $or : a } ).toArray(
            function(e, results) {
                if (e) callback(e)
                else callback(null, results)
            });
}

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({
    local: {
        email: String,
        password: String
    }
});

// Generate a Hash
userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Check Password Validity
userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.local.password);
};

// Create and expose User model to app
module.exports = mongoose.model('User', userSchema);

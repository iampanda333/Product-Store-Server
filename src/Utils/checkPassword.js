const bcrypt = require('bcrypt');

const validatePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
}

module.exports = validatePassword;
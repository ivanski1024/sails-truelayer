const uuidv4 = require('uuid/v4');

createUser = async function (tokens) {
    const userId = uuidv4();
    await User.create({ ...tokens, userId });
    return userId;
}

storeTransactions = async function (userId, tokens) {
    return 'NOT IMPLEMENTED';
}

getTransactions = async function (userId) {
    return 'NOT IMPLEMENTED';
}

module.exports = {
    createUser,
    storeTransactions,
    getTransactions
}
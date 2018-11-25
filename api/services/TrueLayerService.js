
const { AuthAPIClient, DataAPIClient } = require('truelayer-client');
const crypto = require('crypto');

const authClient = new AuthAPIClient(sails.config.trueLayer.auth)
const config = sails.config.trueLayer;

parseTransaction = function (transaction) {

}

validateToken = async function (accessToken) {
    return await DataAPIClient.validateToken(accessToken)
}

refreshTokens = async function (accessToken, refreshToken) {
    let result = await authClient.refreshAccessToken(refreshToken);
    accessToken = result.access_token;
    refreshToken = result.refresh_token;
}

exchangeCodeForTokens = async function (redirectUrl, code) {
    const result = await authClient.exchangeCodeForToken(redirectUrl, code);
    return { accessToken: result.access_token, refreshToken: result.refresh_token };
}

getAuthUrl = function (redirectUrl) {
    const nonce = crypto.randomBytes(12);
    return authClient.getAuthUrl(redirectUrl, config.scopes, nonce, false, false, config.enableMock);
}

fetchBankTransactions = async function (accessToken) {
    let accounts = (await DataAPIClient.getAccounts(accessToken)).results;
    let allTransactions = await Promise.all(accounts.map(async account => {
        return (await DataAPIClient.getTransactions(accessToken, account.account_id)).results;
    }));
    return allTransactions;
}

fetchCardTransactions = async function (accessToken) {
    let cards = (await DataAPIClient.getCards(accessToken)).results;
    let allTransactions = await Promise.all(cards.map(async card => {
        return (await DataAPIClient.getCardTransactions(accessToken, card.account_id)).results;
    }));
    return allTransactions;
}

module.exports = {
    validateToken,
    refreshTokens,
    exchangeCodeForTokens,
    getAuthUrl,
    fetchBankTransactions,
    fetchCardTransactions
};

const { AuthAPIClient, DataAPIClient } = require("truelayer-client");
const crypto = require("crypto");

const authClient = new AuthAPIClient(sails.config.trueLayer.auth)
const config = sails.config.trueLayer;

validateToken =  async function (accessToken) {
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

fetchTransactions = function (tokens) {
    // TODO
    return 'NOT IMPLEMENTED';
}

module.exports = {
    validateToken,
    refreshTokens,
    exchangeCodeForTokens,
    getAuthUrl,
    fetchTransactions
};
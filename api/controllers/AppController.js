const config = sails.config.custom;
const TrueLayerService = sails.services.truelayerservice;
const UserService = sails.services.userservice;

const redirectUrl = config.baseUrl + 'callback';

module.exports = {
  handleRoot: function(req, res) {
    let authUrl = TrueLayerService.getAuthUrl(redirectUrl);
    return res.redirect(authUrl);
  },

  handleCallback: async function(req, res) {
    try {
      let tokens = await TrueLayerService.exchangeCodeForTokens(redirectUrl, req.query.code);
      let userId = await UserService.createUser(tokens);

      // fetch and store bank transactions
      let bankTransactions = await TrueLayerService.fetchBankTransactions(tokens.accessToken);
      await UserService.storeTransactions(userId, bankTransactions)

      // fetch and store card transactions
      let cardTransactions = await TrueLayerService.fetchCardTransactions(tokens.accessToken);
      await UserService.storeTransactions(userId, cardTransactions);

      return res.ok({ status: 'Success', userId: userId });
    } catch (err) {
      return res.serverError({ status: 'Failed', error: err });
    }
  },

  handleGetTransactions: async function (req, res) {
    try {
      let transactions = await UserService.fetchTransactions(req.query.userId);
      return res.ok({ status: 'Success', results: transactions })
    } catch (err) {
      return res.serverError({ status: 'Failed', error: err });
    }
  },

  handleGetDebugInformation: async function (req, res) {
    try {
      let debugInformation = await UserService.fetchDebugInformation(req.query.userId);
      return res.ok({ status: 'Success', results: debugInformation })
    } catch (err) {
      return res.serverError({ status: 'Failed', error: err });
    }
  }
};


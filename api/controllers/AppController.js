/**
 * AppController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const config = sails.config.custom;
const TrueLayerService = sails.services.truelayerservice;
const UserService = sails.services.UserService;

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
      let transactions = await TrueLayerService.fetchTransactions(tokens);
      let result = await UserService.storeTransactions(userId, transactions)
      return result;
    } catch (err) {
      return res.serverError(err);
    }
  },

  handleGetTransactions: async function (req, res) {
    try {
      return await UserService.fetchTransactions(req.query.userId);
    } catch (err) {
      return res.serverError(err);
    }
  },

  handleGetDebugInformation: async function (req, res) {
    try {
      return await UserService.fetchDebugInformation(req.query.userId);
    } catch (err) {
      return res.serverError(err);
    }
  }
};


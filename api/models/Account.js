/**
 * Account.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    account_id: { type: 'string', primaryKey: true },
    account_type: {
      type: 'string',
      isIn: ['card', 'bankAccount'],
      required: true
    },
    user: {
      model: 'user',
      required: true
    },
    transactions: {
      collection: 'transaction',
      via: 'account'
    }
  }
};

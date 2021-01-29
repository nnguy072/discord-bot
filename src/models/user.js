var moment = require('moment');

module.exports = class User {
  id;
  registeredTime;
  channels = [];

  constructor(id) {
    this.id = id;
    this.registeredTime = moment();
  }
};
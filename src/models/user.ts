import moment from 'moment';

export class User {
  id;
  registeredTime;
  channels = [];

  constructor(id: string) {
    this.id = id;
    this.registeredTime = moment();
  }
};
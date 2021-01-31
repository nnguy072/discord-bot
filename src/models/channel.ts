import moment from 'moment';

export class Channel {
  public joined: moment.Moment;

  constructor() {
    this.joined = moment();
  }
};
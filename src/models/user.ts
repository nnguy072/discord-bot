import moment from 'moment';
import { Channel } from './channel';

export class User {
  public id: string;
  public registeredTime: moment.Moment;
  public channels: Channel[] = [];

  constructor(id: string) {
    this.id = id;
    this.registeredTime = moment();
  }
};
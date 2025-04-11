/* tslint:disable */
/* eslint-disable */
import { Application } from '../models/application';
export interface Offre {
  applications?: Array<Application>;
  createdBy?: number;
  description?: string;
  id?: number;
  skills?: string;
  title?: string;
}

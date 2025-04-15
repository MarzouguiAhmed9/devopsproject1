/* tslint:disable */
/* eslint-disable */
import { Application } from '../models/application';

export interface Offre {
  id?: number;
  title?: string;
  description?: string;
  skills?: string;
  imageUrl?: string;         // Match your backend field
  createdBy?: number;
  createdAt?: string;        // LocalDateTime -> string (ISO 8601 format)
  applications?: Array<Application>;
}

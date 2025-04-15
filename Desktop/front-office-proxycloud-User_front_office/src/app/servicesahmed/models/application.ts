/* tslint:disable */
/* eslint-disable */
import { Cv } from '../models/cv';
import { Feedback } from '../models/feedback';
import {Offre} from "./offre";
export interface Application {
  createdBy?: number;
  cv?: Cv;
  feedback?: Feedback;
  id?: number;
  motivatedlettre?: string;
  pdfDownloadLink?: string;
  status?: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  studentId?: number;
  username?: string;
  offre?: { id: number }; // ✅ Only sending the offer's ID

}

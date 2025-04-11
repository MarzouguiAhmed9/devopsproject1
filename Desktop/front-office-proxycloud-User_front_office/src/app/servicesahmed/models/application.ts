/* tslint:disable */
/* eslint-disable */
import { Cv } from '../models/cv';
import { Feedback } from '../models/feedback';
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
}

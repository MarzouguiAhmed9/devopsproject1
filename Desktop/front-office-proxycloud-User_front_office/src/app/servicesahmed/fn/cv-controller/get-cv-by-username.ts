/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';
import {Cv} from "../../models/cv";


export interface GetCvByUsername$Params {
  username: string;
}

export function getCvByUsername(
  http: HttpClient,
  rootUrl: string,
  params: GetCvByUsername$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<Cv>> {  // Assuming Cv is the expected return type
  const rb = new RequestBuilder(rootUrl, getCvByUsername.PATH, 'get');
  if (params) {
    rb.path('username', params.username, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })  // Change responseType to 'json'
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Cv>;  // Assuming Cv is the correct type for the response
    })
  );
}

getCvByUsername.PATH = '/cv/user/{username}';


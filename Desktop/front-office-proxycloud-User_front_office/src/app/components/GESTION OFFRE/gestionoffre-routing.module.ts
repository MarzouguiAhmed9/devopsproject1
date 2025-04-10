import {  NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import {OffreComponent} from "./offre/offre.component";

const routes: Routes = [
  { path: '', component: OffreComponent, pathMatch: 'full' },

];




@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)

  ],

  exports:[RouterModule],
})
export class OffreRoutingModule { }

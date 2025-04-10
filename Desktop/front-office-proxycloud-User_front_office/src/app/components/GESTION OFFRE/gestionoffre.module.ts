import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { OffreComponent } from './offre/offre.component';
import { OffreRoutingModule} from './gestionoffre-routing.module'; // ✅ Import your routing

@NgModule({
  declarations: [
    OffreComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OffreRoutingModule// ✅ This makes routing within this module work
  ]
})
export class GestionoffreModule { } // ✅ Capitalize the module name

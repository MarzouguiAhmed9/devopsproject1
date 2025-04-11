import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import {GestionoffreModule} from "./components/GESTION OFFRE/gestionoffre.module";

const routes: Routes = [
  // Add your routes here when ready
   { path: '', component: HomeComponent },
   {
    path: 'auth',
    loadChildren: () => import('./components/Auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'offre',
    loadChildren: () => import('./components/GESTION OFFRE/gestionoffre.module').then(m => m.GestionoffreModule)
  }

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

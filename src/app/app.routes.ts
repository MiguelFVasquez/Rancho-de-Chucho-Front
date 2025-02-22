import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AdministratorComponent } from './components/administrator/administrator.component';



export const routes: Routes = [
    {path: '',component:HomeComponent},
    {path: 'login',component:LoginComponent},
    { path: 'administrator', component: AdministratorComponent }, /** Redirección al pérfil del administrador/ 
    {path: '**', pathMatch:"full", redirectTo:""} /**Redirección a la página principal */ 

];

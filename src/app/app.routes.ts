import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AdministratorComponent } from './components/administrator/administrator.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MenuComponent } from './components/menu/menu.component';
import { ReportsComponent } from './components/reports/reports.component';
import { InventoryComponent } from './components/inventory/inventory.component';



export const routes: Routes = [
    {path: '',component:HomeComponent},
    {path: 'login',component:LoginComponent},
    { 
        path: 'administrator', 
        component: AdministratorComponent,
        children: [
            { path: '', redirectTo: 'profile', pathMatch: 'full' },
            {path: 'profile',component: ProfileComponent},
            {path: 'menu', component:MenuComponent},
            {path: 'reports', component:ReportsComponent},
            {path: 'inventory', component:InventoryComponent},
        ]
    }, /** Redirección al pérfil del administrador/  */
    
    {path: '**', pathMatch:"full", redirectTo:""} /**Redirección a la página principal */ 

];

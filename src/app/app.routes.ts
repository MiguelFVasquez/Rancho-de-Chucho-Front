import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AdministratorComponent } from './components/administrator/administrator.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MenuComponent } from './components/menu/menu.component';
import { ReportsComponent } from './components/reports/reports.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { MeseroComponent } from './components/mesero/mesero.component';
import { MeseroMenuComponent } from './components/mesero-menu/mesero-menu.component';
import { MeseroOrdenComponent } from './components/mesero-orden/mesero-orden.component';



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
    }, /** Redirección al perfil del administrador/  */
    
    //Redirección al perfil del mesero.
    {
        path: 'mesero',
        component: MeseroComponent,
        children: [
            { path : '', redirectTo: 'profile', pathMatch: 'full'},
            {path: 'profile', component:ProfileComponent},
            {path: 'menu', component:MeseroMenuComponent},
            {path: 'order', component:MeseroOrdenComponent }
        ]

    },
    {path: '**', pathMatch:"full", redirectTo:""} /**Redirección a la página principal */ 

];

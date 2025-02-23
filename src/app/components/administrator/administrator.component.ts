import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AdministratorHeaderComponent } from '../administrator-header/administrator-header.component';

@Component({
  selector: 'app-administrator',
  standalone: true,
  imports: [CommonModule,RouterModule,AdministratorHeaderComponent],
  templateUrl: './administrator.component.html',
  styleUrl: './administrator.component.css'
})

export class AdministratorComponent {

}

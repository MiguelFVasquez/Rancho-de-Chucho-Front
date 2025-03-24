import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MeseroHeaderComponent } from '../mesero-header/mesero-header.component';

@Component({
  selector: 'app-mesero',
  standalone: true,
  imports: [CommonModule,RouterModule, MeseroHeaderComponent],
  templateUrl: './mesero.component.html',
  styleUrl: './mesero.component.css'
})
export class MeseroComponent {

}

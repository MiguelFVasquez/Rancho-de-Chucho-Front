import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StaffHeaderComponent } from "../staff-header/staff-header.component";

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [RouterModule, StaffHeaderComponent],
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.css'
})
export class StaffComponent {

}

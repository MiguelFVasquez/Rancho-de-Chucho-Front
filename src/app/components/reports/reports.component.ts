import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {
  generateHTMLReport() {
    console.log('📄 Generando reporte en HTML...');
    // Aquí iría la lógica para generar el reporte en HTML
  }

  generatePDFReport() {
    console.log('📄 Generando reporte en PDF...');
    // Aquí iría la lógica para generar el reporte en PDF
  }
}
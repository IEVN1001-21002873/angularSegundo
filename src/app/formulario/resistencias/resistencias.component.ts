import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resistencias',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './resistencias.component.html',
  styles: ` `
})
export default class ResistenciasComponent {
  colorBanda1: number = 0;
  colorBanda2: number = 0;
  colorBanda3: number = 0;
  toleranciaPorcentaje: number = 5;
  resistenciaValor: number = 0;
  resistenciaValorMax: number = 0;
  resistenciaValorMin: number = 0;
  listaResistencias: any[] = [];
  mostrarTabla: boolean = false;

  constructor() {
    this.cargarResistenciasGuardadas();
  }

  calcularResistencia() {
    const valorBanda1 = this.colorBanda1.toString();
    const valorBanda2 = this.colorBanda2.toString();
    this.resistenciaValor = parseInt(valorBanda1 + valorBanda2) * this.obtenerMultiplicador(this.colorBanda3);

    const toleranciaDecimal = this.toleranciaPorcentaje / 100;
    this.resistenciaValorMax = this.resistenciaValor + this.resistenciaValor * toleranciaDecimal;
    this.resistenciaValorMin = this.resistenciaValor - this.resistenciaValor * toleranciaDecimal;

    const nuevaResistencia = {
      colorBanda1: this.colorBanda1,
      colorBanda2: this.colorBanda2,
      colorBanda3: this.colorBanda3,
      tolerancia: this.toleranciaPorcentaje,
      valor: this.resistenciaValor,
      valorMax: this.resistenciaValorMax,
      valorMin: this.resistenciaValorMin
    };

    this.listaResistencias.push(nuevaResistencia);
    this.guardarResistencias();
    this.mostrarTabla = false;
  }

  guardarResistencias() {
    localStorage.setItem('resistencias', JSON.stringify(this.listaResistencias));
  }

  cargarResistenciasGuardadas() {
    const registros = localStorage.getItem('resistencias');
    if (registros) {
      this.listaResistencias = JSON.parse(registros);
    }
  }

  mostrarRegistros() {
    this.mostrarTabla = true;
  }

  ocultarRegistros() {
    this.mostrarTabla = false;
  }

  obtenerMultiplicador(banda: number): number {
    const multiplicadores = [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000];
    return multiplicadores[banda] || 1;
  }

  obtenerNombreColor(banda: number): string {
    const nombresColores = ['Negro', 'Café', 'Rojo', 'Naranja', 'Amarillo', 'Verde', 'Azul', 'Violeta', 'Gris', 'Blanco'];
    return nombresColores[banda] || '';
  }

  obtenerCodigoColor(banda: number): string {
    const codigosColores = ['#000000', '#8B4513', '#FF0000', '#FFA500', '#FFFF00', '#008000', '#0000FF', '#EE82EE', '#808080', '#FFFFFF'];
    return codigosColores[banda] || '#000000';
  }
}

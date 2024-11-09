import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

interface Empleado {
  matricula: string;
  nombre: string;
  correo: string;
  edad: number;
  horas: number;
}

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './empleados.component.html',
  styles: [``]
})
export default class EmpleadosComponent implements OnInit {
  empleadoForm!: FormGroup;
  empleados: Empleado[] = [];
  mostrarTabla: boolean = false; // Control para mostrar/ocultar la tabla

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.empleadoForm = this.fb.group({
      matricula: [''],
      nombre: [''],
      correo: [''],
      edad: [''],
      horas: ['']
    });
    this.cargarEmpleados();
  }

  cargarEmpleados(): void {
    const empleadosGuardados = localStorage.getItem('empleados');
    if (empleadosGuardados) {
      this.empleados = JSON.parse(empleadosGuardados);
    }
  }

  guardarEmpleados(): void {
    localStorage.setItem('empleados', JSON.stringify(this.empleados));
  }

  // Registrar empleado
  registrarEmpleado(): void {
    const nuevoEmpleado: Empleado = this.empleadoForm.value;
    const index = this.empleados.findIndex(e => e.matricula === nuevoEmpleado.matricula);
    if (index !== -1) {
      this.empleados[index] = nuevoEmpleado;
    } else {
      this.empleados.push(nuevoEmpleado);
    }
    this.guardarEmpleados();
    this.empleadoForm.reset();
    this.mostrarTabla = false; // Asegurarse de que la tabla esté oculta
  }

  // Mostrar los registros guardados
  mostrarRegistros(): void {
    this.mostrarTabla = true; // Mostrar la tabla cuando se presiona "Imprimir"
  }

  modificarEmpleado(): void {
    const matricula = this.empleadoForm.get('matricula')?.value;
    const empleado = this.empleados.find(e => e.matricula === matricula);
    if (empleado) {
      this.empleadoForm.setValue(empleado);
    }
  }

  eliminarEmpleado(): void {
    const matricula = this.empleadoForm.get('matricula')?.value;
    this.empleados = this.empleados.filter(e => e.matricula !== matricula);
    this.guardarEmpleados();
    this.empleadoForm.reset();
  }

  calcularPagoNormal(horas: number): number {
    const tarifaNormal = 70;
    let horasNormales = horas > 40 ? 40 : horas;
    return horasNormales * tarifaNormal;
  }

  calcularPagoExtra(horas: number): number {
    const tarifaExtra = 140;
    let horasExtras = horas > 40 ? horas - 40 : 0;
    return horasExtras * tarifaExtra;
  }

  calcularPagoTotal(horas: number): number {
    return this.calcularPagoNormal(horas) + this.calcularPagoExtra(horas);
  }

  calcularTotalPagar(): number {
    return this.empleados.reduce((total, empleado) => total + this.calcularPagoTotal(empleado.horas), 0);
  }
}

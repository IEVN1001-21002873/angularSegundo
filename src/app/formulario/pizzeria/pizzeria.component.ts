import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface PizzaOrder {
  id?: number;
  fullName: string;
  address: string;
  phone: string;
  purchaseDate: string;
  pedido: {
    size: string;
    toppings: string[];
    quantity: number;
  };
  price: number;
}

interface Pedido {
  fecha_pedido: string;
  nombre: string;
  direccion: string;
  telefono: string;
  Pedido: PizzaOrder[];
  total: number;
}

@Component({
  selector: 'app-pizzeria',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pizzeria.component.html',
  styles: [``]
})
export default class PizzeriaComponent implements OnInit {
  @ViewChild('ventasFecha') ventasFecha!: ElementRef;
  formGroup!: FormGroup;
  orders: PizzaOrder[] = [];
  toppingOptions = ['Ham', 'Pineapple', 'Mushrooms'];
  sizeOptions = ['Small', 'Medium', 'Large'];
  totalPrice: number = 0;
  ventasDelDia: any[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    try {
      this.initForm();
      this.loadOrdersFromLocalStorage();
      console.log('Form initialized successfully');
    } catch (error) {
      console.error('Error initializing form', error);
    }
  }

  private initForm() {
    try {
      const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
      this.formGroup = this.fb.group({
        fullName: ['', Validators.required],
        address: ['', Validators.required],
        phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        purchaseDate: [{ value: currentDate, disabled: false }, Validators.required],
        size: ['', Validators.required],
        toppings: this.fb.group({
          Ham: [false],
          Pineapple: [false],
          Mushrooms: [false]
        }),
        quantity: [1, [Validators.required, Validators.min(1)]]
      });
      console.log('Form group created successfully');
    } catch (error) {
      console.error('Error creating form group', error);
    }
  }

  private calculatePrice(size: string, toppings: string[], quantity: number): number {
    let price = 0;
    switch (size) {
      case 'Small':
        price = 40;
        break;
      case 'Medium':
        price = 80;
        break;
      case 'Large':
        price = 120;
        break;
    }
    price += toppings.length * 10;
    return price * quantity;
  }

  onSubmit() {
    try {
      if (this.formGroup.valid) {
        const selectedToppings = Object.entries(this.formGroup.value.toppings)
          .filter(([_, selected]) => selected)
          .map(([topping]) => topping);

        const order: PizzaOrder = {
          fullName: this.formGroup.value.fullName,
          address: this.formGroup.value.address,
          phone: this.formGroup.value.phone,
          purchaseDate: this.formGroup.get('purchaseDate')?.value,
          pedido: {
            size: this.formGroup.value.size,
            toppings: selectedToppings,
            quantity: this.formGroup.value.quantity
          },
          price: this.calculatePrice(this.formGroup.value.size, selectedToppings, this.formGroup.value.quantity)
        };

        if (this.orders.length > 0) {
          const lastOrder = this.orders[0];
          if (
            lastOrder.fullName !== order.fullName ||
            lastOrder.address !== order.address ||
            lastOrder.phone !== order.phone
          ) {
            alert('Termina el pedido actual primero');
            return;
          }
        }

        this.orders.push(order);
        this.totalPrice += order.price;
        console.log('Order added successfully', order);

        // Save orders to localStorage
        this.saveOrdersToLocalStorage();

        // Reset only pizza-specific fields, keeping customer information
        this.formGroup.patchValue({
          size: '',
          toppings: {
            Ham: false,
            Pineapple: false,
            Mushrooms: false
          },
          quantity: 1
        });
      } else {
        console.warn('Form is invalid');
      }
    } catch (error) {
      console.error('Error adding order', error);
    }
  }

  removeOrder(index: number) {
    try {
      this.totalPrice -= this.orders[index].price;
      this.orders.splice(index, 1);
      console.log('Order removed successfully', index);

      // Save orders to localStorage
      this.saveOrdersToLocalStorage();
    } catch (error) {
      console.error('Error removing order', error);
    }
  }

  submitOrder() {
    if (this.orders.length > 0) {
      const pedido: Pedido = {
        fecha_pedido: this.formGroup.get('purchaseDate')?.value,
        nombre: this.formGroup.value.fullName,
        direccion: this.formGroup.value.address,
        telefono: this.formGroup.value.phone,
        Pedido: this.orders,
        total: this.totalPrice
      };

      const storedPedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
      storedPedidos.push(pedido);
      localStorage.setItem('pedidos', JSON.stringify(storedPedidos));

      alert('Pedido guardado con éxito en el almacenamiento local');
      this.orders = []; // Clear orders after successful submission
      this.totalPrice = 0; // Reset total price
      this.formGroup.reset(); // Reset the form
      this.initForm(); // Reinitialize the form to set the current date

      // Save orders to localStorage
      this.saveOrdersToLocalStorage();
    } else {
      alert('No hay pedidos para enviar');
    }
  }

  fetchVentasDelDia() {
    const fecha = this.ventasFecha.nativeElement.value;
    console.log('Fetching ventas del día for', fecha);
    try {
      const storedPedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
      this.ventasDelDia = storedPedidos.filter((pedido: any) => pedido.fecha_pedido === fecha);
      console.log('Ventas del día fetched successfully', this.ventasDelDia);
    } catch (error) {
      console.error('Error fetching ventas del día', error);
      alert('Error al obtener las ventas del día');
    }
  }

  private saveOrdersToLocalStorage() {
    localStorage.setItem('orders', JSON.stringify(this.orders));
  }

  private loadOrdersFromLocalStorage() {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    this.orders = storedOrders;
    this.totalPrice = this.orders.reduce((total, order) => total + order.price, 0);
  }
}
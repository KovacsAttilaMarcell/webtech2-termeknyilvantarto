import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

import { Product, ProductService } from '../../services/product';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-products',
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatSnackBarModule,
    MatIconModule
  ],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit {
  username: string | null = '';
  products: Product[] = [];
  displayedColumns: string[] = ['name', 'category', 'price', 'stock', 'actions'];

  product: Product = {
  name: '',
  price: null as any,
  category: '',
  stock: null as any
  };

  editingId: string | null = null;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
      }
    });
  }

  saveProduct(): void {
    if (!this.product.name || !this.product.category || this.product.price <= 0 || this.product.stock < 0) {
      this.showMessage('Kérlek, tölts ki minden mezőt helyesen!');
      return;
    }

    if (this.editingId) {
      this.productService.updateProduct(this.editingId, this.product).subscribe({
        next: () => {
          this.loadProducts();
          this.resetForm();
          this.showMessage('Termék sikeresen módosítva!');
        }
      });
    } else {
      this.productService.addProduct(this.product).subscribe({
        next: () => {
          this.loadProducts();
          this.resetForm();
          this.showMessage('Termék sikeresen hozzáadva!');
        }
      });
    }
  }

  editProduct(product: Product): void {
    this.editingId = product._id || null;
    
    this.product = {
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock
    };
  }

  deleteProduct(id: string | undefined): void {
    if (!id) return;

    if (confirm('Biztosan törölni szeretnéd ezt a terméket?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts();
          this.showMessage('Termék sikeresen törölve!');
        }
      });
    }
  }

  get totalProducts(): number {
  return this.products.length;
}

get totalStock(): number {
  return this.products.reduce((sum, p) => sum + p.stock, 0);
}

get averagePrice(): number {
  if (this.products.length === 0) return 0;

  const total = this.products.reduce((sum, p) => sum + p.price, 0);
  return Math.round(total / this.products.length);
}

  showMessage(message: string): void {
  this.snackBar.open(message, 'Bezárás', {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top'
  });
}

  resetForm(): void {
  this.editingId = null;

  this.product = {
    name: '',
    price: null as any,
    category: '',
    stock: null as any
  };
}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
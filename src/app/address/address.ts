import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface AddressModel {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

@Component({
  selector: 'app-address',
  imports: [CommonModule, FormsModule],
  templateUrl: './address.html',
  styleUrl: './address.css',
})
export class Address {
  protected readonly address = signal<AddressModel>({
    street: '3655 Kingston Road',
    city: 'Toronto',
    state: 'Ontario',
    zip: 'M1M 1M1',
    country: 'Canada',
  });

  protected readonly saved = signal('');

  protected updateField<K extends keyof AddressModel>(key: K, value: string): void {
    this.address.update((current) => ({ ...current, [key]: value }));
  }

  protected onSubmit(): void {
    this.saved.set('Address saved successfully.');
    setTimeout(() => this.saved.set(''), 3000);
  }
}

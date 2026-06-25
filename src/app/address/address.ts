import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface AddressModel {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

@Component({
  standalone: true,
  selector: 'app-address',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './address.html',
  styleUrl: './address.css',
})
export class Address implements OnInit {
  protected readonly address = signal<AddressModel>({
    street: '3655 Kingston Road',
    city: 'Toronto',
    state: 'Ontario',
    zip: 'M1M 1M1',
    country: 'Canada',
  });

  protected readonly addresses = signal<AddressModel[]>([]);
  protected readonly saved = signal('');
  protected readonly loading = signal(true);
  protected readonly error = signal('');

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.loadAddresses();
  }

  protected loadAddresses(): void {
    this.loading.set(true);
    this.error.set('');

    this.http.get<AddressModel[]>('/api/address').subscribe({
      next: (result) => {
        this.addresses.set(result || []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Unable to load addresses from the database.');
        this.loading.set(false);
      },
    });
  }

  protected updateField<K extends keyof AddressModel>(key: K, value: string): void {
    this.address.update((current) => ({ ...current, [key]: value }));
  }

  protected onSubmit(): void {
    this.saved.set('Address saved successfully.');
    setTimeout(() => this.saved.set(''), 3000);
  }
}

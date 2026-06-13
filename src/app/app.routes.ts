import { Routes } from '@angular/router';
import {Address} from './address/address';
import {Information} from './information/information';
import {Birth} from './birth/birth';

export const routes: Routes = [
  { path: 'birth', component: Birth },
  { path: 'address', component: Address },
  { path: 'information', component: Information }
];


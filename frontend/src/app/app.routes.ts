import { Routes } from '@angular/router';

import { Login} from './pages/login/login';
import { Products } from './pages/products/products';

import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    {
        path: '',
        component: Login
    },

    {
        path: 'products',
        component: Products,
        canActivate: [authGuard]
    }
];
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from './components'
import {AuthCallbackComponent} from './components/auth-callback/auth-callback.component'
import {AuthGuard} from './shared/services'

const routes: Routes = [
    { path: '', component: HomeComponent,canActivate: [AuthGuard] },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'auth-callback', component: AuthCallbackComponent }
];

export const AppRoutes = RouterModule.forRoot(routes);

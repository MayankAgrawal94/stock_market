import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';
// import { AuthGuard } from './shared/gaurd/auth.guard';

const routes: Routes = [
    { path: 'home', component: LayoutComponent},
    // { path: 'home', component: LayoutComponent},
    { path: 'login', component: LoginComponent },
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes,{ useHash: true }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

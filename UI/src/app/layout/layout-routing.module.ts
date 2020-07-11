import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { AboutComponent } from './about/about.component';
import { ServicesComponent } from './services/services.component';
import { AuthGuard } from '../shared/gaurd/auth.guard';

const routes: Routes = [
  {
      path: 'home',
      component: LayoutComponent,
      children: [
          { path: 'about',component: AboutComponent },
          { path: 'dashboard',component: ServicesComponent },
      ],
      canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes,{ useHash: true }),
  ],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }

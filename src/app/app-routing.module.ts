import { ProductsModule } from './modules/products/products.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { AuthGuards } from './guards/auth-guards.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },

  {
    path: 'home',
    component: HomeComponent
  },

  {
    path: 'dashboard',
   loadChildren: () =>
   import('./modules/dashboard/dashboard.module').then(
    (m) => m.DashboardModule
   ),
   canActivate: [AuthGuards]
  },
  {
    path: 'products',
    loadChildren: () =>
    import('./modules/products/products.module').then((m) => m.ProductsModule),
    canActivate: [AuthGuards]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

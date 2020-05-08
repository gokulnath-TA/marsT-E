import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { extract } from '@app/core';
import { LoginComponent } from './login.component';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent, data: { title: extract('Login') } }
  ])
];
// const routes: Routes = [
//   Shell.childRoutes([
//     { path: '', redirectTo: '/testmeasure', pathMatch: 'full' },
//     { path: 'testmeasure', component: TestMeasureComponent, data: { title: extract('Test and Execute') } }
//   ])
// ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class LoginRoutingModule {}

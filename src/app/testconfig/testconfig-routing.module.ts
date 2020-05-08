import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { TestConfigComponent } from './testconfig.component';
import { ControlStoreComponent } from '../controlstore/controlstore.component';
import { Shell } from '@app/shell/shell.service';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'testconfig', component: TestConfigComponent, data: { title: extract('Mars Wrigley') } },
    { path: 'controlstore', component: ControlStoreComponent, data: { title: extract('Mars Wrigley') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class TestconfigRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', data: {breadcrumb: 'Generic Dashboard'}, loadChildren: () => import('./generic/dashboardgeneric.module').then(m => m.DashboardGenericModule) },
    ])],
    exports: [RouterModule]
})
export class DashboardsRoutingModule { }
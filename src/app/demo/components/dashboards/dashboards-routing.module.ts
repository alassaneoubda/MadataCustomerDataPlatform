import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', data: {breadcrumb: 'Generic Dashboard'}, loadChildren: () => import('./generic/dashboardgeneric.module').then(m => m.DashboardGenericModule) },
        { path: 'dashboard-banking', data: {breadcrumb: 'Banking Dashboard'}, loadChildren: () => import('./banking/dashboardbanking.module').then(m => m.DashboardBankingModule) },
    ])],
    exports: [RouterModule]
})
export class DashboardsRoutingModule { }
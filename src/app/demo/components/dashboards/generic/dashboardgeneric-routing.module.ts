import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardGenericComponent } from './dashboardgeneric.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DashboardGenericComponent}
    ])],
    exports: [RouterModule]
})
export class DashboardGenericRoutingModule { }
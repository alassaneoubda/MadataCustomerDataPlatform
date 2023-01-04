import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardBankingRoutingModule } from './dashboardbanking-routing.module';
import { DashboardBankingComponent } from './dashboardbanking.component';

@NgModule({
    imports: [
        CommonModule,
        DashboardBankingRoutingModule,
    ],
    declarations: [
        DashboardBankingComponent
    ]
})
export class DashboardBankingModule { }

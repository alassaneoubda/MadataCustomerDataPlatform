import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardGenericRoutingModule } from './dashboardgeneric-routing.module';
import { DashboardGenericComponent } from './dashboardgeneric.component';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { MenuModule } from 'primeng/menu';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@NgModule({
    imports: [
        CommonModule,
        DashboardGenericRoutingModule,
        ButtonModule,
        RippleModule,
        MenuModule,
        ChartModule,
        TableModule,
        InputTextModule,
        OverlayPanelModule
    ],
    declarations: [
        DashboardGenericComponent
    ]
})
export class DashboardGenericModule { }

import {  NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarAppRoutingModule } from './calendar.app-routing.module';
import { CalendarAppComponent } from './calendar.app.component';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast'
import { EventService } from 'src/app/demo/service/event.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FieldsetModule } from 'primeng/fieldset';
import { ToolbarModule } from 'primeng/toolbar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SidebarModule } from 'primeng/sidebar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { DividerModule } from 'primeng/divider';
import { SplitterModule } from 'primeng/splitter';
import { PanelModule } from 'primeng/panel';


@NgModule({
    imports: [
        ToastModule,
        PanelModule,
        SplitterModule,
        DividerModule,
        MenuModule,
        MenuModule,
        TableModule,
        TabViewModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatSidenavModule,
        SidebarModule,
        SplitButtonModule,
        ToolbarModule,
        FieldsetModule,
        CommonModule,
        FormsModule,
        CalendarAppRoutingModule,
        FullCalendarModule,
        DialogModule,
        InputTextareaModule,
        ButtonModule,
        CalendarModule,
        InputTextModule,
        DropdownModule,
        ToastModule,
        RippleModule
    ],
    declarations: [CalendarAppComponent],
    providers: [EventService]
})
export class CalendarAppModule { }

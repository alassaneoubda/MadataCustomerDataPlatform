import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { FileUploadModule } from 'primeng/fileupload';
import { ChartModule } from 'primeng/chart';
import { UploaderComponent } from './uploader/uploader.component';
import { FileAppService } from './service/file.app.service';
import { ToastModule } from 'primeng/toast';
import { FileAppRoutingModule } from './file.app-routing.module';
import { FileAppComponent } from './file.app.component';
import { TabViewModule } from 'primeng/tabview';
import { DividerModule } from 'primeng/divider';
import { SplitterModule } from 'primeng/splitter';
import { PanelModule } from 'primeng/panel';
import { ToolbarModule } from 'primeng/toolbar';
import { FieldsetModule } from 'primeng/fieldset';
import { SplitButtonModule } from 'primeng/splitbutton';
import { DialogModule } from 'primeng/dialog';
import {MatTabsModule} from '@angular/material/tabs';

@NgModule({
    imports: [
        MatTabsModule,
        DialogModule,
        SplitButtonModule,
        FieldsetModule,
        DividerModule,
        ToolbarModule,
        PanelModule,
        SplitterModule,
        TabViewModule,
        CommonModule,
        FileAppRoutingModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        TableModule,
        MenuModule,
        FileUploadModule,
        ChartModule
    ],
    declarations: [FileAppComponent, UploaderComponent],
    providers: [FileAppService]
})
export class FileAppModule { }

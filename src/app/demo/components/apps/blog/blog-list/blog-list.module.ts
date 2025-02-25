import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AvatarModule } from 'primeng/avatar';
import { DataViewModule } from 'primeng/dataview';
import { DropdownModule } from 'primeng/dropdown';
import { BlogListCardComponent } from "./blog-list-card/blog-list-card.component";
import { BlogListComponent } from "./blog-list.component";
import { BlogListRoutingModule } from "./blog-list-routing.module";
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { FileUploadModule } from 'primeng/fileupload';
import { ChartModule } from 'primeng/chart';
import { ToastModule } from 'primeng/toast';
import { TabViewModule } from 'primeng/tabview';
import { DividerModule } from 'primeng/divider';
import { SplitterModule } from 'primeng/splitter';
import { PanelModule } from 'primeng/panel';
import { ToolbarModule } from 'primeng/toolbar';
import { FieldsetModule } from 'primeng/fieldset';
import { SplitButtonModule } from 'primeng/splitbutton';
import { DialogModule } from 'primeng/dialog';
import {MatTabsModule} from '@angular/material/tabs';
import { StepsModule } from 'primeng/steps';
@NgModule({
    imports: [
        StepsModule,
        CommonModule,
        FormsModule,
        AvatarModule,
        BlogListRoutingModule,
        DataViewModule,
        DropdownModule,
        MatTabsModule,
        DialogModule,
        SplitButtonModule,
        FieldsetModule,
        DividerModule,
        ToolbarModule,
        PanelModule,
        SplitterModule,
        TabViewModule,
        CommonModule,        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        TableModule,
        MenuModule,
        FileUploadModule,
        ChartModule
    ],
    declarations: [BlogListComponent, BlogListCardComponent]
  })
  export class BlogListModule { }

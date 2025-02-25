import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatAppRoutingModule } from './chat.app-routing.module';
import { ChatAppComponent } from './chat.app.component';
import { ChatSidebarComponent } from './chat-sidebar/chat-sidebar.component';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { BadgeModule } from 'primeng/badge';
import { UserCardComponent } from './user-card/user-card.component';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { ChatService } from './service/chat.service';
import { RippleModule } from 'primeng/ripple';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { ChartModule } from 'primeng/chart'
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { DividerModule } from 'primeng/divider';
import { SplitterModule } from 'primeng/splitter';
import { PanelModule } from 'primeng/panel';
import { ToolbarModule } from 'primeng/toolbar';
import { FieldsetModule } from 'primeng/fieldset';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SliderModule } from 'primeng/slider';

@NgModule({
    imports: [
        SliderModule,
        SplitButtonModule,
        FieldsetModule,
        ToolbarModule,
        PanelModule,
        SplitterModule,
        DividerModule,
        MenuModule,
        MenuModule,
        TableModule,
        TabViewModule,
        ChartModule,
        MatCardModule,
        MatDialogModule,
        MatButtonModule,
        MatTableModule,
        CommonModule,
        FormsModule,
        ChatAppRoutingModule,
        AvatarModule,
        InputTextModule,
        ButtonModule,
        BadgeModule,
        OverlayPanelModule,
        RippleModule
    ],
    declarations: [
        ChatSidebarComponent,
        ChatAppComponent,
        UserCardComponent,
        ChatBoxComponent
    ],
    providers: [
        ChatService
    ]
})
export class ChatAppModule { }

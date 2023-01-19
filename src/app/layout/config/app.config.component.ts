import { Component, Input, OnInit } from '@angular/core';
import { MenuService } from '../app.menu.service';
import { LayoutService } from '../service/app.layout.service';

@Component({
    selector: 'app-config',
    templateUrl: './app.config.component.html'
})
export class AppConfigComponent implements OnInit {

    @Input() minimal: boolean = false;

    componentThemes: any[] = [];

    menuThemes: any[] = [];

    topbarThemes: any[] = [];

    scales: number[] = [12,13,14,15,16];

    constructor(public layoutService: LayoutService, public menuService: MenuService) { }

    get visible(): boolean {
        return this.layoutService.state.configSidebarVisible;
    }

    set visible(_val: boolean) {
        this.layoutService.state.configSidebarVisible = _val;
    }

    get scale(): number {
        return this.layoutService.config.scale;
    }

    set scale(_val: number) {
        this.layoutService.config.scale = _val;
    }

    get menuMode(): string {
        return this.layoutService.config.menuMode;
    }

    set menuMode(_val: string) {
        this.layoutService.config.menuMode = _val;
        if (this.layoutService.isSlim() || this.layoutService.isHorizontal()) {
            this.menuService.reset();
        }
    }

    get menuProfilePosition(): string {
        return this.layoutService.config.menuProfilePosition;
    }

    set menuProfilePosition(_val: string) {
        this.layoutService.config.menuProfilePosition = _val;
        if (this.layoutService.isSlim() || this.layoutService.isHorizontal()) {
            this.menuService.reset();
        }
    }

    get colorScheme(): string {
        return this.layoutService.config.colorScheme;
    }

    set colorScheme(_val: string) {
        this.changeColorScheme(_val);
    }

    get inputStyle(): string {
        return this.layoutService.config.inputStyle;
    }

    set inputStyle(_val: string) {
        this.layoutService.config.inputStyle = _val;
    }

    get ripple(): boolean {
        return this.layoutService.config.ripple;
    }

    set ripple(_val: boolean) {
        this.layoutService.config.ripple = _val;
    }

    get menuTheme(): string {
        return this.layoutService.config.menuTheme;
    }

    get topbarTheme(): string {
        return this.layoutService.config.topbarTheme;
    }

    get componentTheme(): string {
        return this.layoutService.config.componentTheme;
    }

    ngOnInit() {
        this.componentThemes = [
            {name: 'purple', color: '#6f42c1'},
            {name: 'indigo', color: '#6610f2'},
            {name: 'pink', color: '#d63384'},
            {name: 'blue', color: '#0d6efd'},
            {name: 'cyan', color: '#0dcaf0'},
            {name: 'teal', color: '#20c997'},
            {name: 'green', color: '#198754'},
            {name: 'yellow', color: '#ffc107'},
            {name: 'orange', color: '#fd7e14'},
        ];

        this.menuThemes = [
            {name: 'light', color: '#ffffff'},
            {name: 'dark', color: '#212529'},
            {name: 'indigo', color: '#6610f2'},
            {name: 'cyan', color: '#0dcaf0'},
            {name: 'green', color: '#198754'},
            {name: 'pink', color: '#d63384'},
            {name: 'purple', color: '#6f42c1'},
            {name: 'teal', color: '#20c997'}
        ];

        this.topbarThemes = [
            {name: 'light', color: '#FFFFFF'},
            {name: 'dark', color: '#212529'},
            {name: 'blue', color: '#1565C0'},
            {name: 'purple', color: '#6A1B9A'},
            {name: 'pink', color: '#AD1457'},
            {name: 'cyan', color: '#0097A7'},
            {name: 'teal', color: '#00796B'},
            {name: 'green', color: '#43A047'},
            {name: 'yellow', color: '#FBC02D'},
            {name: 'orange', color: '#FB8C00'},
            {name: 'indigo', color: '#3F51B5'}
        ];
    }

    onConfigButtonClick() {
        this.layoutService.showConfigSidebar();
    }

    changeColorScheme(colorScheme: string) {
        this.layoutService.onColorSchemeChange(colorScheme);
    }

    changeTheme(theme: string) {
        const themeLink = <HTMLLinkElement>document.getElementById('theme-link');
        const newHref = themeLink.getAttribute('href')!.replace(this.layoutService.config.componentTheme, theme);
        this.layoutService.replaceThemeLink(newHref, () => {
            this.layoutService.config.componentTheme = theme;
            this.layoutService.onConfigUpdate();
        });
    }

    changeTopbarTheme(theme:string) {
        this.layoutService.config.topbarTheme = theme;
        this.layoutService.onConfigUpdate();
    }

    changeMenuTheme(theme:string) {
        this.layoutService.config.menuTheme = theme;
        this.layoutService.onConfigUpdate();
    }

    decrementScale() {
        this.scale--;
        this.applyScale();
    }

    incrementScale() {
        this.scale++;
        this.applyScale();
    }

    applyScale() {
        document.documentElement.style.fontSize = this.scale + 'px';
    }
    
}

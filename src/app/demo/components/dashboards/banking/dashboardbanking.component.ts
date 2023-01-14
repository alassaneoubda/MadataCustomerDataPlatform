import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Product } from 'src/app/demo/api/product';
import { ProductService } from 'src/app/demo/service/product.service';

@Component({
    templateUrl: './dashboardbanking.component.html',
})
export class DashboardBankingComponent implements OnInit {

    products: Product[] = [];
    
    dropdownItem: SelectItem[] = [];

    selectedDropdownItem: any;

    constructor(private productService : ProductService) { }

    ngOnInit() {
        this.productService.getProducts().then(data => this.products = data);
        this.dropdownItem.push({ label: 'Select One', value: null });
        this.dropdownItem.push({ label: 'Xbox Series X', value: { id: 1, name: 'Xbox One', code: 'XO' } });
        this.dropdownItem.push({ label: 'PlayStation 5', value: { id: 2, name: 'PS4', code: 'PS4' } });
        this.dropdownItem.push({ label: 'Nintendo Switch', value: { id: 3, name: 'Wii U', code: 'WU' } });
    }
}

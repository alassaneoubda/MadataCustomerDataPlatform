import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/demo/api/product';
import { ProductService } from 'src/app/demo/service/product.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    templateUrl: './dashboardbanking.component.html',
})
export class DashboardBankingComponent implements OnInit {

    products: Product[] = [];

    dropdownItem: SelectItem[] = [];

    selectedDropdownItem: any;

    visitorChart: any;

    visitorChartOptions: any;

    subscription!: Subscription


    constructor(private productService: ProductService, private layoutService: LayoutService) {
        this.subscription = layoutService.configUpdate$.subscribe(config =>{
            this.initChart()
        })
     }

    ngOnInit() {
        this.productService.getProducts().then(data => this.products = data);
        this.dropdownItem.push({ label: 'Select One', value: null });
        this.dropdownItem.push({ label: 'Xbox Series X', value: { id: 1, name: 'Xbox One', code: 'XO' } });
        this.dropdownItem.push({ label: 'PlayStation 5', value: { id: 2, name: 'PS4', code: 'PS4' } });
        this.dropdownItem.push({ label: 'Nintendo Switch', value: { id: 3, name: 'Wii U', code: 'WU' } });

        this.initChart();

    }

    initChart() {
        const textColor = getComputedStyle(document.body).getPropertyValue('--text-color')
        const surfaceLight = getComputedStyle(document.body).getPropertyValue('--surface-100')

        this.visitorChart = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    data: [600, 671, 660, 665, 700, 610, 810, 790, 710, 860, 810, 780],
                    backgroundColor: '#6f42c1',
                    fill: true,
                    barPercentage: 0.75,
                    stepped: true
                }
            ]
        };

        this.visitorChartOptions = {
            plugins: {
                legend: {
                    display: false
                }
            },
            responsive: true,
            hover: {
                mode: 'index'
            },
            scales: {
                y: {
                    min: 500,
                    max: 900,
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: surfaceLight
                    }
                },
                x: {
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        display: false
                    }
                }
            }
        };
    }
}

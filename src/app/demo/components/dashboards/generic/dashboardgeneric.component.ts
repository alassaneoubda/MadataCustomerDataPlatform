import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/demo/api/product';
import { AppConfig, LayoutService } from 'src/app/layout/service/app.layout.service';
import { ProductService } from '../../../service/product.service';

@Component({
    templateUrl: './dashboardgeneric.component.html',
})
export class DashboardGenericComponent implements OnInit {

    products!: Product[];

    chartData: any;

    chartOptions: any;

    config!: AppConfig

    items!: MenuItem[];

    chatMessages: any[] = [];

    chatEmojis: any[] = [];

    subscription!: Subscription;

    @ViewChild('chatcontainer') chatContainerViewChild!: ElementRef;

    
    constructor(private productService: ProductService, public layoutService: LayoutService) {
        this.subscription = this.layoutService.configUpdate$.subscribe(config => {
            this.config = config;
            this.chartInit()
        });
    }

    ngOnInit() {
        this.productService.getProducts().then(data => this.products = data);

        this.chatMessages = [
            { from: 'Ioni Bowcher', url: 'assets/demo/images/avatar/ionibowcher.png', messages: ['Retro occupy organic, stumptown shabby chic pour-over roof party DIY normcore.'] },
            { messages: ['Actually artisan organic occupy, Wes Anderson ugh whatever pour-over gastropub selvage.'] },
            { from: 'Ioni Bowcher', url: 'assets/demo/images/avatar/ionibowcher.png', messages: ['Chillwave craft beer tote bag stumptown quinoa hashtag.'] },
            { messages: ['Dreamcatcher locavore iPhone chillwave, occupy trust fund slow-carb distillery art party narwhal.', 'Sed ut perspiciatis unde omnis iste natus.'] },
            { from: 'Ioni Bowcher', url: 'assets/demo/images/avatar/ionibowcher.png', messages: ['Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse.'] },
            { messages: ['At vero eos et accusamus.'] }
        ];

        this.chatEmojis = [
            '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😇', '😉', '😊', '🙂', '🙃', '😋', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '🤪', '😜', '😝', '😛',
            '🤑', '😎', '🤓', '🧐', '🤠', '🥳', '🤗', '🤡', '😏', '😶', '😐', '😑', '😒', '🙄', '🤨', '🤔', '🤫', '🤭', '🤥', '😳', '😞', '😟', '😠', '😡', '🤬', '😔',
            '😟', '😠', '😡', '🤬', '😔', '😕', '🙁', '😬', '🥺', '😣', '😖', '😫', '😩', '🥱', '😤', '😮', '😱', '😨', '😰', '😯', '😦', '😧', '😢', '😥', '😪', '🤤'
        ];
        
        this.chartInit()
    }

    chartInit() {
        const textColor = getComputedStyle(document.body).getPropertyValue('--text-color') || 'rgba(0, 0, 0, 0.87)';

        this.items = [
            {
                label: 'Options',
                items: [
                    { label: 'Add New', icon: 'pi pi-fw pi-plus' },
                    { label: 'Search', icon: 'pi pi-fw pi-search' }
                ]
            }];

        this.chartData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'New',
                    data: [11, 17, 30, 60, 88, 92],
                    backgroundColor: 'rgba(13, 202, 240, .2)',
                    borderColor: '#0dcaf0',
                    pointBackgroundColor: '#0dcaf0',
                    pointBorderColor: '#0dcaf0',
                    pointBorderWidth: 0,
                    pointStyle: 'line',
                    fill: false,
                    tension: .4
                },
                {
                    label: 'Completed',
                    data: [11, 19, 39, 59, 69, 71],
                    backgroundColor: 'rgba(253, 126, 20, .2)',
                    borderColor: '#fd7e14',
                    pointBackgroundColor: '#fd7e14',
                    pointBorderColor: '#fd7e14',
                    pointBorderWidth: 0,
                    pointStyle: 'line',
                    fill: false,
                    tension: .4
                },
                {
                    label: 'Canceled',
                    data: [11, 17, 21, 30, 47, 83],
                    backgroundColor: 'rgba(111, 66, 193, .2)',
                    borderColor: '#6f42c1',
                    pointBackgroundColor: '#6f42c1',
                    pointBorderColor: '#6f42c1',
                    pointBorderWidth: 0,
                    pointStyle: 'line',
                    fill: true,
                    tension: .4
                }
            ]
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    fill: true,
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                y: {
                    max: 100,
                    min: 0,
                    ticks: {
                        color: textColor
                    }
                },
                x: {
                    grid: {
                        display: true,
                    },
                    ticks: {
                        color: textColor,
                        beginAtZero: true,
                    }
                }
            }
        };
    }

    onEmojiClick(chatInput: any, emoji: string) {
        if (chatInput) {
            chatInput.value += emoji;
            chatInput.focus();
        }
    }

    onChatKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            const message = (<HTMLInputElement>event.currentTarget).value;
            const lastMessage = this.chatMessages[this.chatMessages.length - 1];

            if (lastMessage.from) {
                this.chatMessages.push({ messages: [message] });
            }
            else {
                lastMessage.messages.push(message);
            }

            if (message.match(/primeng|primereact|primefaces|primevue/i)) {
                this.chatMessages.push({ from: 'Ioni Bowcher', url: 'assets/demo/images/avatar/ionibowcher.png', messages: ['Always bet on Prime!'] });
            }

            (<HTMLInputElement>event.currentTarget).value = '';

            const el = this.chatContainerViewChild.nativeElement;
            setTimeout(() => {
                el.scroll({
                    top: el.scrollHeight,
                    behavior: 'smooth'
                });
            }, 1);
        }
    }
}

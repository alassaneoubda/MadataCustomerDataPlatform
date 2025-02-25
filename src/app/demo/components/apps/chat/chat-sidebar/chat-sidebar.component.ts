import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from 'src/app/demo/api/user';
import { ChatService } from '../service/chat.service';
import { Subscription, debounceTime } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { EventItem } from '../../../../api/Scope'; // Adjust the path as needed
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root', // Cela garantit que le service est injecté globalement
})
export class UnomiService {
    private baseUrl = 'http://66.29.155.72:8181';
    private authHeader = 'Basic ' + btoa('karaf:karaf'); // Replace with secure credentials
    events: any[] = [];
    filteredEvents: any[] = [];
    data: any;
    options: any;
    loading: boolean = true;
    searchTerm: string = '';
    // Propriétés pour le slider
    selectedDuration: number = 0; // Valeur initiale (correspond à "30 minutes")
    durationLabels: string[] = [
        '30 minutes',
        '5 heures',
        '24 heures',
        '72 heures',
        '1 semaine',
        '1 mois',
        '3 mois',
        '6 mois',
        '1 an',
    ];


    constructor(private http: HttpClient) {}

    // Fetch events from Unomi
    getEvents(): Observable<any> {
        const url = `${this.baseUrl}/cxs/events/search`;
        const headers = {
            Authorization: this.authHeader,
            'Content-Type': 'application/json',
        };
        const body = {
            sortby: 'timeStamp:desc',
            condition: { type: 'matchAllCondition' },
        };
        return this.http.post(url, body, { headers });
    }
    getProfiles(): Observable<any> {
        const url = `${this.baseUrl}/cxs/profiles/search`;
        const headers = {
            Authorization: this.authHeader,
            'Content-Type': 'application/json',
        };
        const body = {
            condition: { type: 'matchAllCondition' },
        };
        return this.http.post<any>(url, body, { headers });
    }
}

@Component({
    selector: 'app-chat-sidebar',
    templateUrl: './chat-sidebar.component.html',
    styleUrls: ['./event.scss'],
})
export class ChatSidebarComponent implements OnInit, OnDestroy {
    loading: boolean = true;
    events: any[] = [];
    filteredEvents: any[] = [];
    profiles: any[] = [];
    data: any;
    options: any;
    subscription: Subscription;
    barData: any;
    barOptions: any;
    pieData: any;
    pieOptions: any;
    searchTerm: string = '';
    
    constructor(public layoutService: LayoutService, private unomiService: UnomiService) {
        this.subscription = this.layoutService.configUpdate$
            .pipe(debounceTime(25))
            .subscribe(() => {
                this.initCharts();
            });
    }

    ngOnInit(): void {
        this.initCharts();
        this.loadTestData();
        this.loadEvents(); // Appel initial pour charger les événements

        this.unomiService.getProfiles().subscribe(
            (response) => {
                this.profiles = response.list;
            },
            (error) => {
                console.error('Error fetching profiles:', error);
            }
        );
    }

    loadTestData() {
        this.data = {
            labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet'],
            datasets: [
                {
                    label: 'Événements 2024',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    borderColor: '#4bc0c0',
                    tension: 0.4
                },
                {
                    label: 'Événements 2023',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    borderColor: '#565656',
                    tension: 0.4
                }
            ]
        };

        this.options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };
    }

    initCharts() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.options = {
            ...this.options,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };

        this.pieData = {
            labels: ['A', 'B', 'C'],
            datasets: [
                {
                    data: [540, 325, 702],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--indigo-500'),
                        documentStyle.getPropertyValue('--purple-500'),
                        documentStyle.getPropertyValue('--teal-500'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--indigo-400'),
                        documentStyle.getPropertyValue('--purple-400'),
                        documentStyle.getPropertyValue('--teal-400'),
                    ],
                },
            ],
        };

        this.pieOptions = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor,
                    },
                },
            },
        };

        this.barData = {
            labels: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
            ],
            datasets: [
                {
                    label: 'profile',
                    backgroundColor:
                        documentStyle.getPropertyValue('--primary-500'),
                    borderColor:
                        documentStyle.getPropertyValue('--primary-500'),
                    data: [65, 59, 80, 81, 56, 55, 40],
                },
                {
                    label: 'segment ',
                    backgroundColor:
                        documentStyle.getPropertyValue('--primary-200'),
                    borderColor:
                        documentStyle.getPropertyValue('--primary-200'),
                    data: [28, 48, 40, 19, 86, 27, 90],
                },
            ],
        };

        this.barOptions = {
            plugins: {
                legend: {
                    labels: {
                        fontColor: textColor,
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500,
                        },
                    },
                    grid: {
                        display: false,
                        drawBorder: false,
                    },
                },
                y: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
            },
        };
    }

    updateChartData() {
        const eventTypeCount = this.events.reduce((acc, event) => {
            acc[event.eventType] = (acc[event.eventType] || 0) + 1;
            return acc;
        }, {});

        const scopeCount = this.events.reduce((acc, event) => {
            if (event.scope) {
                acc[event.scope] = (acc[event.scope] || 0) + 1;
            }
            return acc;
        }, {});

        const labels = Object.keys(eventTypeCount);
        const data = Object.values(eventTypeCount);

        // Ajout de la visualisation de la fréquence des événements
        const frequencyData = this.events.reduce((acc, event) => {
            const date = new Date(event.timeStamp).toLocaleDateString(); // Format de date
            acc[date] = acc[date] || {};
            acc[date][event.scope] = (acc[date][event.scope] || 0) + 1; // Compte par scope
            return acc;
        }, {});

        const frequencyLabels = Object.keys(frequencyData);
        const frequencyValues = frequencyLabels.map(date => {
            return Object.values(frequencyData[date]);
        });

        this.data = {
            labels: labels,
            datasets: [
                {
                    label: 'Types d\'Événements',
                    data: data,
                    fill: false,
                    borderColor: '#4bc0c0',
                    tension: 0.4
                },
                {
                    label: 'Fréquence des Événements',
                    data: frequencyValues.flat(), // Aplatir les valeurs pour le graphique
                    fill: false,
                    borderColor: '#ff6384',
                    tension: 0.4
                }
            ]
        };

        const scopeLabels = Object.keys(scopeCount);
        const scopeData = Object.values(scopeCount);

        this.barData = {
            labels: scopeLabels,
            datasets: [
                {
                    label: 'Nombre d\'Événements par Scope',
                    backgroundColor: '#565656',
                    data: scopeData,
                }
            ]
        };

        this.options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };
    }

    loadEvents(): void {
        this.unomiService.getEvents().subscribe(
            (response) => {
                this.events = response.list || [];
                this.filteredEvents = [...this.events];
                this.updateChartData();
                this.loading = false;
            },
            (error) => console.error('Error loading events:', error)
        );
    }

    filterEvents() {
        this.filteredEvents = this.events.filter(event => {
            return (
                (event.eventType && event.eventType.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
                (event.scope && event.scope.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
                (event.profileId && event.profileId.toString().includes(this.searchTerm))
            );
        });
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}

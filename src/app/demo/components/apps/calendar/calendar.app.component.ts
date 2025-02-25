import { Component, ElementRef,OnInit } from '@angular/core';
import { ScopeService } from './scope.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Table } from 'primeng/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import hljs from 'highlight.js';
import { ChangeDetectorRef } from '@angular/core';

// @fullcalendar plugins
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Scope } from 'src/app/demo/api/Scope';
import { O } from '@fullcalendar/core/internal-common';


@Component({
    templateUrl: './calendar.app.component.html',
    styleUrls: ['./calendar.app.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class CalendarAppComponent implements OnInit  {
  
  showSuccessViaToast() {
    this.service.add({ key: 'tst', severity: 'success', summary: 'Scope crée avec succes',  });
}
showSuccessViaToast1() {
  this.service.add({ key: 'tst', severity: 'success', summary: 'Scope Supprimé avec succes',  });
}

  //=====================================================================================================
  selectedScope: any | null = null; // Scope actuellement sélectionné

  trackerCode: string | null = null;
  
  //===================================== =====================================================

    sidebarVisible: boolean = false;
    //bouton
    eventcreaton() {
        this.sidebarVisible = true;
    };
    eventcreatoff(){
      this.sidebarVisible = false;

    };
    sidebarevent: boolean = false;
    //bouton
   
    showevent(scope: any): void {
      this.sidebarevent = true;
      this.selectedScope = scope; // Enregistre le scope sélectionné
    }
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // side bar
    visibleSidebar: boolean = false;
    scope : Scope={};
    scopeDialog: boolean = false;
    scopeForm: FormGroup;
    successMessage: string = '';
    errorMessage: string = '';
    scopes: any[] = [];
  private apiUrl = 'http://66.29.155.72:8181/cxs/scopes';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa('karaf:karaf') // Remplacez par vos identifiants
    })
  };
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  toggleSidebar() {
    this.visibleSidebar = true;
  }
 
  
    constructor(
      private service: MessageService,
      private http: HttpClient,
      private scopeService: ScopeService,
      private messageService: MessageService, private confirmationService: ConfirmationService,
      private fb: FormBuilder,
      private el: ElementRef,
      private cdr: ChangeDetectorRef,


   ) { 
      const trackerScript = this.generateTracker('myTrackId', 'mySiteId');
      console.log(trackerScript);
      this.scopeForm = this.fb.group({
        name: ['', Validators.required],
        description: ['', Validators.required],
      });
    }
    ngOnInit(): void {
      this.loadScopes();
       
    const blocks = this.el.nativeElement.querySelectorAll('pre code');
    blocks.forEach((block: HTMLElement): void => {
      hljs.highlightBlock(block);
    });
    }
    deleteScope(scopeId: string): void {
      this.scopeService.deleteScope(scopeId).subscribe({
        next: () => {
          this.scopes = this.scopes.filter(scope => scope.metadata.id !== scopeId);  // Mettre à jour la liste des scopes après suppression
          this.successMessage = 'Scope supprimé avec succès.'
          
        },
        error: (error) => {
          this.errorMessage = 'Une erreur est survenue lors de la suppression du scope.';
        }
      });
    }
    loadScopes(): void {
      this.http.get<any[]>(this.apiUrl, this.httpOptions).subscribe({
        next: (data) => {
          this.scopes = data;
            console.error('scope charger', this.scopes);

           ;
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la récupération des scopes : ' + error.message;
        }
      });
    }
    // this.product.id = this.createId();
    // this.product.code = this.createId();
    onSubmit(): void {
      if (this.scopeForm.valid) {
          const scope = {
              itemId: this.scopeForm.value.name,
              metadata: {
                  id: this.scopeForm.value.name,
                  name: this.scopeForm.value.name,
                  description: this.scopeForm.value.description,
              },
          };
  
          this.http.post('http://66.29.155.72:8181/cxs/scopes', scope, {
              headers: new HttpHeaders({
                  'Content-Type': 'application/json',
                  'Authorization': 'Basic ' + btoa('karaf:karaf')
              }),
          }).subscribe({
              next: (response) => {
                  console.log('Scope created successfully', response);
                  this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Scope créé avec succès' });
                  this.loadScopes(); // Recharge les scopes après la création
                  this.scopeForm.reset(); // Réinitialise le formulaire
                  this.sidebarVisible = false; // Ferme le dialogue

                  this.cdr.detectChanges(); // Force Angular à détecter les changements

              },
              error: (error) => {
                  console.error('Error creating scope', error);
              },
          });
      }
  }
  
    createId(): string {
      let scopeIdd= '';
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for (let i = 0; i < 5; i++) {
        scopeIdd += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return scopeIdd;
  }
  generateTracker(TrackId: any , siteId :  any): string {
    const trackerCode = `<script type="text/javascript" src="/tracker/unomi-web-tracker.min.js"></script>
<script>
  (function () {
const unomiWebTracker = useTracker();
const unomiTrackerTestConf = {
    "scope": "${TrackId}",
    "site": {
        "siteInfo": {
            "siteID": "${siteId}"
        }
    },
    "page": {
        "pageInfo": {
            "pageID": "${siteId}",
            "pageName": document.title,
            "pagePath": document.location.pathname,
            "destinationURL": document.location.origin + document.location.pathname,
            "language": "en",
            "categories": [],
            "tags": []
        },
        "attributes": {},
        "consentTypes": []
    },
    "events:": [],
    "wemInitConfig": {
        "contextServerUrl": document.location.origin,
        "timeoutInMilliseconds": "1500",
        "contextServerCookieName": "context-profile-id",
        "activateWem": true,
        "trackerSessionIdCookieName": "unomi-tracker-test-session-id",
        "trackerProfileIdCookieName": "unomi-tracker-test-profile-id"
    }
}
// generate a new session
if (unomiWebTracker.getCookie(unomiTrackerTestConf.wemInitConfig.trackerSessionIdCookieName) == null) {
    unomiWebTracker.setCookie(unomiTrackerTestConf.wemInitConfig.trackerSessionIdCookieName, unomiWebTracker.generateGuid(), 1);
}

// init tracker with our conf
unomiWebTracker.initTracker(unomiTrackerTestConf);

unomiWebTracker._registerCallback(() => {
    console.log("Unomi tracker test successfully loaded context", unomiWebTracker.getLoadedContext());
}, 'Unomi tracker test callback example');

// start the tracker
unomiWebTracker.startTracker();
})();
</script>`;




    return this.escapeHtml(trackerCode);
  }

  escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  }
  

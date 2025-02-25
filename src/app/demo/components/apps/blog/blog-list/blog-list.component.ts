import { Component, OnInit } from '@angular/core';
import { UnomiService } from './unomi.service';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.scss']
})
export class BlogListComponent implements OnInit {
  // Sélection du scope
  scopes: { label: string; value: string }[] = [];
  selectedScope: string = '';
  loading: boolean = true;

  segments: any[] = [];  // Tableau pour stocker les segments récupérés
  sidebarVisible: boolean = false;
  segmentcreation() {
    this.sidebarVisible = true;
};

  // Type de condition sélectionné
  selectedConditionType: string = '';
  profileProperties: { label: string; value: string }[] = [];

  // Pour récupérer dynamiquement les propriétés d'événements
  eventProperties: { label: string; value: string }[] = [];

  // Pour profilePropertyCondition
  selectedProfileProperty: string = '';
  operatorsProfile: { label: string; value: string }[] = [
    { label: 'Existe', value: 'exists' },
    { label: 'N\'existe pas', value: 'missing' },
    { label: 'Égale à', value: 'equals' }
  ];
  selectedOperatorProfile: string = '';
  profilePropertyValue: string = '';

  // Pour les conditions sur les événements
  eventTypes: { label: string; value: string }[] = [];
  selectedEventType: string = '';
  eventTypeMinCount: number | null = null; // Nombre minimum d'occurrences

  // Pour eventPropertyCondition
  operatorsEvent: { label: string; value: string }[] = [
    { label: 'Égale à', value: 'equals' },
    { label: 'Différent de', value: 'notEquals' },
    { label: 'Contient', value: 'contains' },
    { label: 'Ne contient pas', value: 'notContains' },
    { label: 'Commence par', value: 'startsWith' },
    { label: 'Finit par', value: 'endsWith' },
    { label: 'Existe', value: 'exists' },
    { label: 'N\'existe pas', value: 'missing' }
  ];
  selectedOperatorEvent: string = '';
  customEventProperty: string = '';
  eventPropertyValue: string = '';
  eventPropertyMinCount: number | null = null; // Seuil d'occurrences
  // Propriétés à ajouter dans BlogListComponent (ou SegmentListComponent)
selectedSegment: any = null;
segmentDetailsVisible: boolean = false;
activeIndex: number = 0;

// Tableaux pour stocker les profils affiliés et les événements admissibles au segment
affiliatedProfiles: any[] = [];
qualifyingEvents: any[] = [];

// Items pour le stepper (deux étapes)
stepItems: any[] = [
  { label: 'Détails du segment' },
  { label: 'Profils et Événements' }
];

  // Tableau des conditions ajoutées
  conditions: any[] = [];
  allEvents: any[] = [];

  // Métadonnées du segment
  segmentName: string = '';
  segmentDescription: string = '';
  selectedOperatorBetweenConditions: string = 'and';
  operatorsBetweenConditions: { label: string; value: string }[] = [
    { label: 'ET (AND)', value: 'and' },
    { label: 'OU (OR)', value: 'or' }
  ];

  // Animation
  isVisible: boolean = false;

  constructor(private unomiService: UnomiService) {}

  ngOnInit(): void {
    this.loadScopes();
    this.loadSegments();
    this.loadEvents();
    this.loadProfileProperties(); // Charge dynamiquement les propriétés de profil
    this.isVisible = true;
  }
  showSegmentDetails(segment: any): void {
    if (!segment || !segment.id) {
        console.error('Segment invalide ou sans ID:', segment);
        return;
    }

    this.selectedSegment = segment;
    this.segmentDetailsVisible = true;
    this.activeIndex = 0;

    // Récupérer les profils et événements affiliés au segment
    this.loadAffiliatedProfiles(segment.id);
    this.loadQualifyingEvents(segment.id);
}

  
loadAffiliatedProfiles(segmentId: string): void {
  this.unomiService.getProfilesForSegment(segmentId).subscribe({
    next: (data) => {
      console.log('✅ Profils récupérés pour le segment:', data);
      this.affiliatedProfiles = data.list || [];
    },
    error: (err) => console.error('❌ Erreur lors du chargement des profils affiliés', err)
  });
}
  
  
  
  loadQualifyingEvents(segmentId: string): void {
    // Exemple d'appel à une méthode de votre service
    this.unomiService.getEventsForSegment(segmentId).subscribe({
      next: (data) => {
        this.qualifyingEvents = data;
      },
      error: (err) => console.error('Erreur chargement événements', err)
    });
  }
  prevStep(): void {
    if (this.activeIndex > 0) {
      this.activeIndex--;
    }
  }
  
  nextStep(): void {
    if (this.activeIndex < this.stepItems.length - 1) {
      this.activeIndex++;
    }
  }
  
  closeSegmentDetails(): void {
    this.segmentDetailsVisible = false;
  }
  
  loadSegments(): void {
    this.unomiService.getSegments().subscribe(
      data => {
        this.segments = data;  // Supposons que la réponse contient une liste de segments
        this.loading = false;
        console.log(this.segments,'data')
      },
      
      error => {
        console.error('Error fetching segments', error);
        this.loading = false;
      }
    );
  }

  /**
   * Extrait les propriétés des événements pour le type d'événement sélectionné.
   * Assurez-vous d'appeler cette méthode via (onChange) sur le dropdown de sélection du type d'événement.
   */
  loadEventProperties(): void {
    if (!this.selectedEventType) {
      this.eventProperties = [];
      return;
    }
    // Filtrer les événements par type sélectionné
    const filteredEvents = this.allEvents.filter(
      (event) => event.eventType === this.selectedEventType
    );
  
    const keysSet = new Set<string>();
  
    // Parcourir les événements filtrés et récupérer les clés de source et target
    filteredEvents.forEach((event) => {
      if (event.source && typeof event.source === 'object') {
        Object.keys(event.source).forEach((key) => {
          keysSet.add(`source.${key}`);
        });
      }
      if (event.target && typeof event.target === 'object') {
        Object.keys(event.target).forEach((key) => {
          keysSet.add(`target.${key}`);
        });
      }
    });
  
    // Transformer le Set en tableau d'options pour le dropdown
    this.eventProperties = Array.from(keysSet).map((key) => ({
      label: key,
      value: key
    }));
  
    console.log('Propriétés issues de source et target:', this.eventProperties);
  }
  


  loadProfileProperties(): void {
    this.unomiService.getProfileProperties().subscribe({
      next: (data) => {
        // Vérifier que data contient bien un tableau "profiles"
        if (data.profiles && Array.isArray(data.profiles)) {
          this.profileProperties = data.profiles.map((prop: any) => {
            // On utilise metadata.name s'il est disponible, sinon itemId
            const label = prop.metadata && prop.metadata.name ? prop.metadata.name : prop.itemId;
            return { label: label, value: prop.itemId };
          });
        }
      },
      error: (err) => console.error('❌ Erreur récupération des propriétés de profils', err)
    });
  }
  
  loadEvents(): void {
    this.unomiService.getEvents().subscribe({
      next: (data) => {
        this.allEvents = data.list || [];
        // Si un scope est sélectionné, mettre à jour la liste des types d'événements
        if (this.selectedScope) {
          const filteredEvents = this.allEvents.filter(
            (event) => event.scope === this.selectedScope
          );
          const uniqueEventTypes = Array.from(
            new Set(filteredEvents.map((event) => event.eventType))
          );
          this.eventTypes = uniqueEventTypes.map((eventType) => ({
            label: eventType,
            value: eventType
          }));
        }
      },
      error: (err) =>
        console.error('❌ Erreur récupération des événements', err)
    });
  }
  /**
 * Supprime un segment en appelant le service Unomi.
 * @param segmentId L'identifiant du segment à supprimer.
 */
deleteSegment(segmentId: string): void {
  if (!confirm("Êtes-vous sûr de vouloir supprimer ce segment ?")) {
    return; // Annule la suppression si l'utilisateur annule la boîte de dialogue
  }

  this.unomiService.deleteSegment(segmentId).subscribe({
    next: () => {
      console.log(`✅ Segment ${segmentId} supprimé avec succès.`);
      this.segments = this.segments.filter(segment => segment.id !== segmentId); // Mise à jour locale
    },
    error: (err) => console.error(`❌ Erreur lors de la suppression du segment ${segmentId}`, err)
  });
}


  loadScopes(): void {
    this.unomiService.getScopes().subscribe({
      next: (data) => {
        this.scopes = data.map((item: { itemId: string }) => ({
          label: item.itemId,
          value: item.itemId
        }));
      },
      error: (err) =>
        console.error('❌ Erreur récupération des scopes', err)
    });
  }

  filterEventTypes(): void {
    if (!this.selectedScope) return;
    const filteredEvents = this.allEvents.filter(
      (event) => event.scope === this.selectedScope
    );
    const uniqueEventTypes = Array.from(
      new Set(filteredEvents.map((event) => event.eventType))
    );
    this.eventTypes = uniqueEventTypes.map((eventType) => ({
      label: eventType,
      value: eventType
    }));
    // Réinitialiser les champs liés aux événements
    this.selectedEventType = '';
    this.eventTypeMinCount = null;
    this.customEventProperty = '';
    this.selectedOperatorEvent = '';
    this.eventPropertyValue = '';
    this.eventPropertyMinCount = null;
    // Réinitialiser le dropdown des propriétés d'événement
    this.eventProperties = [];
  }

  addCondition(): void {
    if (!this.selectedConditionType) {
      console.warn('Veuillez sélectionner un type de condition.');
      return;
    }
    let condition: any;

    switch (this.selectedConditionType) {
      case 'profilePropertyCondition':
        condition = {
          type: 'profilePropertyCondition',
          parameterValues: {
            propertyName: `properties.${this.selectedProfileProperty}`,
            comparisonOperator: this.selectedOperatorProfile
          }
        };
        if (this.selectedOperatorProfile !== 'exists' && this.selectedOperatorProfile !== 'missing') {
          condition.parameterValues.propertyValue = isNaN(Number(this.profilePropertyValue))
            ? this.profilePropertyValue
            : Number(this.profilePropertyValue);
        }
        break;
      case 'eventTypeCondition':
       
      condition = {
        type: 'eventTypeCondition',
        parameterValues: {
          eventType: this.selectedEventType,
          // eventProperty: this.customEventProperty,
          comparisonOperator: this.selectedOperatorEvent
        }
      };
      if (this.selectedOperatorEvent !== 'exists' && this.selectedOperatorEvent !== 'missing') {
        condition.parameterValues.propertyValue = isNaN(Number(this.eventPropertyValue))
          ? this.eventPropertyValue
          : Number(this.eventPropertyValue);
      }
      if (this.eventPropertyMinCount !== null) {
        condition.parameterValues.minimumEventCount = this.eventPropertyMinCount;
      }
      break;
    case 'eventPropertyCondition':
      condition = {
        type: 'eventPropertyCondition',
        parameterValues: {
          eventType: this.selectedEventType,
          eventProperty: this.customEventProperty,
          comparisonOperator: this.selectedOperatorEvent
        }
      };
      if (this.selectedOperatorEvent !== 'exists' && this.selectedOperatorEvent !== 'missing') {
        condition.parameterValues.propertyValue = isNaN(Number(this.eventPropertyValue))
          ? this.eventPropertyValue
          : Number(this.eventPropertyValue);
      }
      if (this.eventPropertyMinCount !== null) {
        condition.parameterValues.minimumEventCount = this.eventPropertyMinCount;
      }
      break;
    default:
      console.warn('Type de condition non reconnu :', this.selectedConditionType);
      return;
  }
  this.conditions.push(condition);
  this.resetConditionFields();
}

/**
 * Fonction privée pour générer un hash simple à partir du type d'événement.
 * Cela permet d'obtenir une clé unique pour la propriété dynamique.
 */
private hashEventType(eventType: string): string {
  return eventType.split('').reduce((acc, char) => acc + char.charCodeAt(0).toString(16), '');
}

  resetConditionFields(): void {
    this.selectedConditionType = '';
    // Réinitialisation pour profilePropertyCondition
    this.selectedProfileProperty = '';
    this.selectedOperatorProfile = '';
    this.profilePropertyValue = '';
    // Réinitialisation pour eventTypeCondition et eventPropertyCondition
    this.selectedEventType = '';
    this.eventTypeMinCount = null;
    this.customEventProperty = '';
    this.selectedOperatorEvent = '';
    this.eventPropertyValue = '';
    this.eventPropertyMinCount = null;
  }

  createSegment(): void {
    if (!this.segmentName) {
      console.warn('⚠️ Nom du segment et conditions obligatoires.');
      return;
    }
    const segmentJson = {
      metadata: {
        id: this.segmentName.toLowerCase().replace(/\s+/g, '_'),
        name: this.segmentName,
        scope: this.selectedScope,
        description: this.segmentDescription,
        readOnly: false
      },
      condition: {
        type: 'booleanCondition',
        parameterValues: {
          operator: this.selectedOperatorBetweenConditions,
          subConditions: this.conditions
        }
      }
    };

    console.log('🛠️ Payload envoyé à Unomi:', JSON.stringify(segmentJson, null, 2));

    this.unomiService.createSegment(segmentJson).subscribe({
      next: () => {
        alert('✅ Segment créé avec succès !');
        this.conditions = [];
        this.segmentName = '';
        this.segmentDescription = '';
      },
      error: (err) => console.error('❌ Erreur création segment', err)
    });
  }
}

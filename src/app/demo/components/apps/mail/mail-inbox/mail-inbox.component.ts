import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface OperatorDefinition {
  label: string;
  value: string;
  requiresValue: boolean;
  valueType?: string;
}

type ConditionType = 
  'profilePropertyCondition' | 
  'eventPropertyCondition' | 
  'eventTypeCondition' | 
  'sessionPropertyCondition';

@Component({
  selector: 'app-mail-inbox',
  templateUrl: './mail-inbox.component.html',
  styleUrls: ['./mail-inbox.component.css']
})
export class MailInboxComponent implements OnInit {
  segmentForm!: FormGroup;

  scopes: any[] = [];
  allEvents: any[] = [];
  eventTypes: { label: string, value: string }[] = [];
  profileProperties: string[] = [];
  eventProperties: string[] = [];

  conditionTypes = [
    { value: 'profilePropertyCondition', label: 'Profile Property Condition' },
    { value: 'eventPropertyCondition', label: 'Event Property Condition' },
    { value: 'eventTypeCondition', label: 'Event Type Condition' },
    { value: 'sessionPropertyCondition', label: 'Session Property Condition' }
  ];

  operators: { [key in ConditionType]: OperatorDefinition[] } = {
    profilePropertyCondition: [
      { label: 'Exists', value: 'exists', requiresValue: false },
      { label: 'Equals', value: 'equals', requiresValue: true, valueType: 'string' },
      { label: 'Greater Than', value: 'greaterThan', requiresValue: true, valueType: 'number' }
    ],
    eventPropertyCondition: [
      { label: 'Exists', value: 'exists', requiresValue: false },
      { label: 'Equals', value: 'equals', requiresValue: true, valueType: 'string' },
      { label: 'Less Than', value: 'lessThan', requiresValue: true, valueType: 'number' }
    ],
    eventTypeCondition: [
      { label: 'Equals', value: 'equals', requiresValue: true, valueType: 'string' }
    ],
    sessionPropertyCondition: [
      { label: 'Exists', value: 'exists', requiresValue: false },
      { label: 'Equals', value: 'equals', requiresValue: true, valueType: 'string' },
      { label: 'Greater Than', value: 'greaterThan', requiresValue: true, valueType: 'number' }
    ]
  };

  booleanOperators = ['AND', 'OR'];
  conditions: any[] = [];
  segmentJson: any;
  
  unomiUrl = 'http://66.29.155.72:8181';
  headers = new HttpHeaders({
    'Authorization': 'Basic ' + btoa('karaf:karaf'),
    'Content-Type': 'application/json'
  });

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    this.segmentForm = this.fb.group({
      segmentName: ['', Validators.required],
      segmentDescription: [''],
      isGlobal: ['true'],
      selectedScope: [''],
      conditionType: ['profilePropertyCondition'],
      propertyName: [''],
      eventType: [''],
      operator: [''],
      conditionValue: [''],
      booleanOperator: ['AND']
    });

    this.loadScopes();
    this.loadEvents();
    this.loadProfileProperties();

    this.segmentForm.get('selectedScope')!.valueChanges.subscribe(() => {
      this.filterEventTypes();
    });

    this.segmentForm.get('eventType')!.valueChanges.subscribe(() => {
      this.loadEventProperties();
    });
  }

  loadScopes(): void {
    this.http.get<any[]>(`${this.unomiUrl}/cxs/scopes`, { headers: this.headers })
      .subscribe(data => {
        this.scopes = data.map(item => ({ label: item.itemId, value: item.itemId }));
      }, error => {
        console.error('Erreur récupération scopes', error);
      });
  }

  loadEvents(): void {
    const body = {
      "offset": 0,
      "limit": 100,
      "condition": { "type": "matchAllCondition", "parameterValues": {} }
    };
    this.http.post<any>(`${this.unomiUrl}/cxs/events/search`, body, { headers: this.headers })
      .subscribe(data => {
        this.allEvents = data.list || [];
      }, error => {
        console.error('Erreur récupération événements', error);
      });
  }

  filterEventTypes(): void {
    const scope = this.segmentForm.get('selectedScope')!.value;
    const filteredEvents = this.allEvents.filter(event => event.scope === scope);
    const uniqueEventTypes = Array.from(new Set(filteredEvents.map(event => event.eventType)));
    this.eventTypes = uniqueEventTypes.map(eventType => ({ label: eventType, value: eventType }));
  }

  loadEventProperties(): void {
    const eventType = this.segmentForm.get('eventType')!.value;
    const filteredEvents = this.allEvents.filter(event => event.eventType === eventType);
    const uniqueProperties = Array.from(new Set(filteredEvents.flatMap(event => Object.keys(event))));
    this.eventProperties = uniqueProperties;
  }

  loadProfileProperties(): void {
    this.profileProperties = ['properties.email', 'properties.firstName', 'properties.lastName', 'properties.age'];
  }

  getCurrentOperators(): OperatorDefinition[] {
    const conditionType = this.segmentForm.get('conditionType')!.value as ConditionType;
    return this.operators[conditionType] || [];
  }

  generateSegmentJson(): void {
    this.segmentJson = {
      itemId: this.segmentForm.get('segmentName')!.value,
      metadata: {
        name: this.segmentForm.get('segmentName')!.value,
        description: this.segmentForm.get('segmentDescription')!.value
      },
      scope: this.segmentForm.get('isGlobal')!.value === 'true' ? 'global' : this.segmentForm.get('selectedScope')!.value,
      condition: {
        type: 'booleanCondition',
        parameterValues: {
          operator: this.segmentForm.get('booleanOperator')!.value,
          subConditions: this.conditions
        }
      }
    };
  }

  submitSegment(): void {
    this.generateSegmentJson();
    this.http.post(`${this.unomiUrl}/cxs/segments`, this.segmentJson, { headers: this.headers })
      .subscribe(() => alert('✅ Segment créé !'), error => console.error('❌ Erreur création segment', error));
  }
}

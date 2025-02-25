import { Component, OnInit } from '@angular/core';
import { FileAppService } from './service/file.app.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-file',
  templateUrl: './file.app.component.html',
  styleUrls: ['./file.app.component.scss'],
})
export class FileAppComponent implements OnInit {
  profiles: any[] = []; // Liste des profils
  allEvents: any[] = []; // Liste complète des événements
  filteredEvents: any[] = []; // Événements filtrés liés au profil actif
  activeProfile: any | null = null; // Profil actif
  profileDialog: boolean = false; // État de la boîte de dialogue
  loading: boolean = true; // Indicateur de chargement
  error: string | null = null; // Gestion des erreurs
  data: any; // Nouvelle propriété pour stocker les données du graphique
  options: any; // Déclaration de la propriété options
  profileContexts: any[] = []; // ✅ Stocke les données contextuelles des sessions

  constructor(
    private fileService: FileAppService,
    private layoutService: LayoutService
  ) {
    // Initialisation des options du graphique
    this.options = {
      responsive: true,
      maintainAspectRatio: false,
      // Ajoutez d'autres options de configuration si nécessaire
    };
  }

  ngOnInit(): void {

    // Charger les profils
    this.fileService.getProfiles().subscribe({
      next: (data: any) => {
        this.profiles = data.list.map((profile: any) => ({
          itemId: profile.itemId,
          nbOfVisits: profile.properties?.nbOfVisits,
          lastVisit: profile.properties?.lastVisit,
          firstVisit: profile.properties?.firstVisit,
          properties: profile.properties,
        }));
        console.log('Profils chargés :', this.profiles);  // Log des profils
        this.loading = false;
        this.prepareChartData(); // Appel de la méthode pour préparer les données du graphique
      },
      error: () => {
        this.error = 'Erreur lors du chargement des profils.';
        this.loading = false;
      },
    });

    // Charger tous les événements
    this.fileService.getAllEvents().subscribe({
      next: (data: any) => {
        console.log('Réponse brute de l\'API pour les événements data :', data); // Log de la réponse brute
        this.allEvents = data.list || [];
        console.log('data1', data.list || [] )
        console.log('Événements chargés :', this.allEvents);  // Log des événements
      },
      error: (err) => {
        console.error('Erreur lors du chargement des événements :', err);
      },
    });
  }

  // Nouvelle méthode pour préparer les données du graphique
  prepareChartData(): void {
    const monthlyVisits: { [key: string]: number } = {}; // Typage de monthlyVisits

    this.profiles.forEach(profile => {
      const month = new Date(profile.lastVisit).toLocaleString('fr-FR', { month: 'long' });
      if (!monthlyVisits[month]) {
        monthlyVisits[month] = 0;
      }
      monthlyVisits[month] += profile.nbOfVisits || 0; // Compte le nombre de visites
    });

    this.data = {
      labels: Object.keys(monthlyVisits),
      datasets: [
        {
          label: 'Visites par mois',
          data: Object.values(monthlyVisits),
          fill: false,
          borderColor: '#42A5F5',
          tension: 0.1
        }
      ]
    };
  }

  handleClick(profile: any): void {
    this.activeProfile = profile;
    console.log('Profil actif sélectionné :', this.activeProfile);

    // 1️⃣ Filtrer les événements liés au profil actif
    this.filteredEvents = this.allEvents.filter(event => event.profileId === profile.itemId);
    console.log('Événements filtrés pour le profil actif :', this.filteredEvents);

    // 2️⃣ Extraire les sessionId uniques
    const sessionIds = [...new Set(this.filteredEvents.map(event => event.sessionId).filter(id => id))];
    console.log('Session IDs trouvés :', sessionIds);

    // 3️⃣ Réinitialiser la variable qui va stocker les résultats
    this.profileContexts = [];

    // 4️⃣ Faire une requête pour chaque sessionId et stocker les résultats
    sessionIds.forEach(sessionId => {
        this.fileService.getContextBySession(sessionId).subscribe({
            next: (contextData) => {
                console.log(`Données du contexte pour sessionId ${sessionId} :`, contextData);
                this.profileContexts.push(contextData); // Stocker les résultats
            },
            error: (err) => {
                console.error(`Erreur pour sessionId ${sessionId} :`, err);
            }
        });
        
    });
    

    // 5️⃣ Ouvrir la boîte de dialogue
    this.openProfileDialog();
}
getDestinationURL(filteredEvents: any): string {
  if (filteredEvents.eventType === 'view' || filteredEvents.eventType === 'click') {
      return filteredEvents.target?.properties?.pageInfo?.destinationURL ||
      filteredEvents.source?.properties?.pageInfo?.destinationURL || 'URL non disponible';
  } 
  if (filteredEvents.eventType === 'contactInfoSubmitted') {
      return filteredEvents.source?.properties?.pageInfo?.destinationURL ||
             'URL non disponible';
  } 
  return 'URL non disponible';
}
getPage(filteredEvents: any): string {
  if (filteredEvents.eventType === 'view' || filteredEvents.eventType === 'click') {
      return filteredEvents.target?.properties?.pageInfo?.pageName ||
      filteredEvents.source?.properties?.pageInfo?.pageName || 'URL non disponible';
  } 
  if (filteredEvents.eventType === 'contactInfoSubmitted') {
      return filteredEvents.source?.properties?.pageInfo?.pageName ||
             'URL non disponible';
  } 
  return 'URL non disponible';
}


  openProfileDialog(): void {
    console.log('Ouverture de la boîte de dialogue pour le profil :', this.activeProfile);  // Log de l'ouverture de la boîte de dialogue
    this.profileDialog = true;
  }

  // Assurez-vous d'avoir cette fonction dans votre composant
formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}
}

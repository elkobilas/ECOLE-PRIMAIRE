// Module de gestion de l'agenda scolaire
class AgendaModule {
    constructor(app) {
        this.app = app;
        this.currentEventId = null;
    }

    getAgendaHTML() {
        return `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2><i class="fas fa-calendar-alt me-2 text-primary"></i>Agenda Scolaire</h2>
                <button class="btn btn-primary" onclick="app.agendaModule.showAddEventModal()">
                    <i class="fas fa-plus me-1"></i>Planifier un événement
                </button>
            </div>

            <!-- Filtres -->
            <div class="card mb-4">
                <div class="card-body">
                    <div class="row g-3">
                        <div class="col-md-5">
                            <div class="input-group">
                                <span class="input-group-text bg-transparent border-end-0"><i class="fas fa-search text-muted"></i></span>
                                <input type="text" class="form-control border-start-0" id="eventSearch" 
                                       placeholder="Rechercher un événement..." 
                                       onkeyup="app.agendaModule.filterEvents()">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <select class="form-select" id="eventTypeFilter" onchange="app.agendaModule.filterEvents()">
                                <option value="all">Tous les types d'événements</option>
                                <option value="Vacances">Vacances / Férié</option>
                                <option value="Examen">Évaluation / Examen</option>
                                <option value="Réunion">Réunion parents-profs</option>
                                <option value="Activité">Activité périscolaire / Sortie</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <button class="btn btn-success w-100" onclick="app.agendaModule.exportEvents()">
                                <i class="fas fa-file-export me-1"></i>Exporter en CSV
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Liste des événements -->
            <div class="row" id="eventsGrid">
                <div class="col-12 text-center py-4">
                    <p class="text-muted"><i class="fas fa-spinner fa-spin fa-2x mb-2"></i><br>Chargement des événements...</p>
                </div>
            </div>

            <!-- Modal d'ajout/modification d'événement -->
            <div class="modal fade" id="eventModal" tabindex="-1" aria-labelledby="eventModalTitle" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="eventModalTitle">Planifier un événement</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
                        </div>
                        <div class="modal-body text-start">
                            <form id="eventForm">
                                <div class="mb-3">
                                    <label for="eventTitle" class="form-label">Titre de l'événement *</label>
                                    <input type="text" class="form-control" id="eventTitle" placeholder="Ex: Réunion de rentrée" required>
                                </div>
                                <div class="mb-3">
                                    <label for="eventType" class="form-label">Type d'événement *</label>
                                    <select class="form-select" id="eventType" required>
                                        <option value="">Sélectionner un type</option>
                                        <option value="Vacances">Vacances / Férié</option>
                                        <option value="Examen">Évaluation / Examen</option>
                                        <option value="Réunion">Réunion parents-profs</option>
                                        <option value="Activité">Activité périscolaire / Sortie</option>
                                    </select>
                                </div>
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="eventStartDate" class="form-label">Date de début *</label>
                                        <input type="date" class="form-control" id="eventStartDate" required>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="eventEndDate" class="form-label">Date de fin</label>
                                        <input type="date" class="form-control" id="eventEndDate">
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="eventLocation" class="form-label">Lieu</label>
                                    <input type="text" class="form-control" id="eventLocation" placeholder="Ex: Salle des fêtes, Classe CP A">
                                </div>
                                <div class="mb-3">
                                    <label for="eventDescription" class="form-label">Description</label>
                                    <textarea class="form-control" id="eventDescription" rows="3" placeholder="Informations complémentaires..."></textarea>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                            <button type="button" class="btn btn-primary" onclick="app.agendaModule.saveEvent()">
                                <i class="fas fa-save me-1"></i>Enregistrer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    loadAgendaData() {
        if (!localStorage.getItem('events')) {
            // Initialiser avec des événements par défaut
            const defaultEvents = [
                {
                    id: 1,
                    title: "Réunion de rentrée des classes",
                    type: "Réunion",
                    startDate: new Date().toISOString().split('T')[0],
                    endDate: new Date().toISOString().split('T')[0],
                    location: "Réfectoire principal",
                    description: "Présentation de l'année scolaire aux parents d'élèves."
                },
                {
                    id: 2,
                    title: "Vacances d'Hiver",
                    type: "Vacances",
                    startDate: "2026-12-21",
                    endDate: "2027-01-04",
                    location: "Toute l'école",
                    description: "Vacances scolaires de Noël."
                },
                {
                    id: 3,
                    title: "Évaluations du Premier Trimestre",
                    type: "Examen",
                    startDate: "2026-11-23",
                    endDate: "2026-11-27",
                    location: "Dans les classes",
                    description: "Période d'évaluation générale pour toutes les matières."
                },
                {
                    id: 4,
                    title: "Sortie au Musée des Sciences",
                    type: "Activité",
                    startDate: "2026-06-10",
                    endDate: "2026-06-10",
                    location: "Musée des Sciences Naturelles",
                    description: "Sortie éducative de fin d'année pour les classes de CM1 et CM2."
                }
            ];
            localStorage.setItem('events', JSON.stringify(defaultEvents));
        }

        this.displayEvents();
    }

    getEvents() {
        return JSON.parse(localStorage.getItem('events')) || [];
    }

    saveEvents(events) {
        localStorage.setItem('events', JSON.stringify(events));
    }

    getEventIcon(type) {
        switch(type) {
            case 'Vacances': return 'fa-umbrella-beach text-success';
            case 'Examen': return 'fa-file-signature text-danger';
            case 'Réunion': return 'fa-comments text-warning';
            case 'Activité': return 'fa-bus text-info';
            default: return 'fa-calendar text-primary';
        }
    }

    getEventBadgeClass(type) {
        switch(type) {
            case 'Vacances': return 'bg-success';
            case 'Examen': return 'bg-danger';
            case 'Réunion': return 'bg-warning text-dark';
            case 'Activité': return 'bg-info';
            default: return 'bg-primary';
        }
    }

    displayEvents() {
        const grid = document.getElementById('eventsGrid');
        if (!grid) return;

        const events = this.getFilteredEvents();

        if (events.length === 0) {
            grid.innerHTML = `
                <div class="col-12 text-center py-5">
                    <p class="text-muted"><i class="fas fa-calendar-times fa-3x mb-3 text-secondary"></i><br>Aucun événement programmé</p>
                </div>
            `;
            return;
        }

        // Trier par date la plus proche (événements futurs d'abord)
        events.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

        grid.innerHTML = events.map(evt => {
            const icon = this.getEventIcon(evt.type);
            const badgeClass = this.getEventBadgeClass(evt.type);
            
            const startFmt = new Date(evt.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
            let endFmt = '';
            if (evt.endDate && evt.endDate !== evt.startDate) {
                endFmt = ' au ' + new Date(evt.endDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
            }

            return `
                <div class="col-md-6 mb-4">
                    <div class="card h-100 event-card event-${evt.type.toLowerCase()}">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-3">
                                <span class="badge ${badgeClass}">${evt.type}</span>
                                <div class="text-muted small">
                                    <i class="fas fa-calendar-day me-1"></i> Du ${startFmt}${endFmt}
                                </div>
                            </div>
                            
                            <h5 class="card-title text-dark fw-bold mb-2">
                                <i class="fas ${icon} me-2"></i>${evt.title}
                            </h5>
                            
                            <p class="card-text text-secondary mb-3">${evt.description || 'Aucune description fournie.'}</p>
                            
                            ${evt.location ? `
                                <div class="text-muted small mb-0">
                                    <i class="fas fa-map-marker-alt me-2 text-danger"></i><strong>Lieu:</strong> ${evt.location}
                                </div>
                            ` : ''}
                        </div>
                        <div class="card-footer bg-transparent border-top-0 d-flex justify-content-end gap-2">
                            <button class="btn btn-sm btn-info" onclick="app.agendaModule.viewEventDetails(${evt.id})" title="Détails">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-warning" onclick="app.agendaModule.editEvent(${evt.id})" title="Modifier">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="app.agendaModule.deleteEvent(${evt.id})" title="Supprimer">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    getFilteredEvents() {
        let events = this.getEvents();

        // Filtre recherche
        const searchTerm = document.getElementById('eventSearch')?.value.toLowerCase() || '';
        if (searchTerm) {
            events = events.filter(e => 
                e.title.toLowerCase().includes(searchTerm) || 
                (e.description && e.description.toLowerCase().includes(searchTerm)) ||
                (e.location && e.location.toLowerCase().includes(searchTerm))
            );
        }

        // Filtre type
        const typeFilter = document.getElementById('eventTypeFilter')?.value || 'all';
        if (typeFilter !== 'all') {
            events = events.filter(e => e.type === typeFilter);
        }

        return events;
    }

    filterEvents() {
        this.displayEvents();
    }

    showAddEventModal() {
        this.currentEventId = null;
        
        // Ensure form elements exist before resetting
        const form = document.getElementById('eventForm');
        if (form) {
            form.reset();
        }
        
        const titleEl = document.getElementById('eventModalTitle');
        if (titleEl) {
            titleEl.textContent = 'Planifier un événement';
        }
        
        const startDateEl = document.getElementById('eventStartDate');
        if (startDateEl) {
            startDateEl.valueAsDate = new Date();
        }

        const modal = new bootstrap.Modal(document.getElementById('eventModal'));
        modal.show();
    }

    editEvent(eventId) {
        const events = this.getEvents();
        const evt = events.find(e => e.id === eventId);
        if (!evt) return;

        this.currentEventId = eventId;
        
        const titleInput = document.getElementById('eventTitle');
        if (titleInput) titleInput.value = evt.title;
        
        const typeInput = document.getElementById('eventType');
        if (typeInput) typeInput.value = evt.type;
        
        const startInput = document.getElementById('eventStartDate');
        if (startInput) startInput.value = evt.startDate;
        
        const endInput = document.getElementById('eventEndDate');
        if (endInput) endInput.value = evt.endDate || '';
        
        const locInput = document.getElementById('eventLocation');
        if (locInput) locInput.value = evt.location || '';
        
        const descInput = document.getElementById('eventDescription');
        if (descInput) descInput.value = evt.description || '';

        const titleEl = document.getElementById('eventModalTitle');
        if (titleEl) titleEl.textContent = 'Modifier l\'événement';

        const modal = new bootstrap.Modal(document.getElementById('eventModal'));
        modal.show();
    }

    saveEvent() {
        const titleVal = document.getElementById('eventTitle')?.value || '';
        const title = titleVal.trim();
        const type = document.getElementById('eventType')?.value || '';
        const startDate = document.getElementById('eventStartDate')?.value || '';
        const endDate = document.getElementById('eventEndDate')?.value || startDate;
        const locationVal = document.getElementById('eventLocation')?.value || '';
        const location = locationVal.trim();
        const descriptionVal = document.getElementById('eventDescription')?.value || '';
        const description = descriptionVal.trim();

        if (!title || !type || !startDate) {
            this.app.showNotification('Veuillez remplir tous les champs obligatoires.', 'danger');
            return;
        }

        const events = this.getEvents();
        const eventData = {
            id: this.currentEventId || Date.now(),
            title,
            type,
            startDate,
            endDate,
            location,
            description
        };

        if (this.currentEventId) {
            // Edit
            const idx = events.findIndex(e => e.id === this.currentEventId);
            if (idx !== -1) {
                events[idx] = eventData;
                this.app.logActivity(`Modification d'un événement : ${title}`, `Type: ${type}, Date: ${startDate}`, 'edit');
            }
        } else {
            // Add
            events.push(eventData);
            this.app.logActivity(`Ajout d'un événement : ${title}`, `Type: ${type}, Date: ${startDate}`, 'add');
        }

        this.saveEvents(events);
        this.app.showNotification('Événement enregistré avec succès.', 'success');

        // Close modal
        const modalEl = document.getElementById('eventModal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) {
            modal.hide();
        }

        this.displayEvents();
    }

    deleteEvent(eventId) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) return;

        const events = this.getEvents();
        const evt = events.find(e => e.id === eventId);
        
        if (evt) {
            const filtered = events.filter(e => e.id !== eventId);
            this.saveEvents(filtered);
            this.app.logActivity(`Suppression de l'événement : ${evt.title}`, `Type: ${evt.type}`, 'delete');
            this.app.showNotification('Événement supprimé avec succès.', 'success');
            this.displayEvents();
        }
    }

    viewEventDetails(eventId) {
        const events = this.getEvents();
        const evt = events.find(e => e.id === eventId);
        if (!evt) return;

        const startFmt = new Date(evt.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
        const endFmt = evt.endDate && evt.endDate !== evt.startDate ?
            new Date(evt.endDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : startFmt;

        const badgeClass = this.getEventBadgeClass(evt.type);
        const icon = this.getEventIcon(evt.type);

        const html = `
            <div class="text-center mb-4">
                <div class="detail-avatar bg-primary" style="background: var(--gradient-${evt.type === 'Vacances' ? 'success' : evt.type === 'Examen' ? 'danger' : evt.type === 'Réunion' ? 'warning' : 'info'});">
                    <i class="fas ${icon}"></i>
                </div>
                <h4 class="fw-bold">${evt.title}</h4>
                <span class="badge ${badgeClass}">${evt.type}</span>
            </div>

            <div class="detail-field">
                <div class="detail-label"><i class="fas fa-calendar-alt me-1"></i>Date de début</div>
                <div class="detail-value">${startFmt}</div>
            </div>

            <div class="detail-field">
                <div class="detail-label"><i class="fas fa-calendar-check me-1"></i>Date de fin</div>
                <div class="detail-value">${endFmt}</div>
            </div>

            ${evt.location ? `
                <div class="detail-field">
                    <div class="detail-label"><i class="fas fa-map-marker-alt me-1"></i>Lieu</div>
                    <div class="detail-value">${evt.location}</div>
                </div>
            ` : ''}

            <div class="detail-field">
                <div class="detail-label"><i class="fas fa-info-circle me-1"></i>Description</div>
                <div class="detail-value">${evt.description || 'Aucune description.'}</div>
            </div>
        `;

        document.getElementById('detailsModalTitle').textContent = "Détails de l'Événement";
        document.getElementById('detailsModalBody').innerHTML = html;

        const modal = new bootstrap.Modal(document.getElementById('detailsModal'));
        modal.show();
    }

    exportEvents() {
        const events = this.getEvents();
        const headers = ['Titre', 'Type', 'Date Début', 'Date Fin', 'Lieu', 'Description'];
        const rows = events.map(e => [
            e.title,
            e.type,
            e.startDate,
            e.endDate || e.startDate,
            e.location || '',
            e.description || ''
        ]);

        const csvContent = [headers, ...rows].map(row =>
            row.map(field => `"${field.replace(/"/g, '""')}"`).join(',')
        ).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'agenda_scolaire.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.app.showNotification('Export CSV de l\'agenda réussi', 'success');
    }
}

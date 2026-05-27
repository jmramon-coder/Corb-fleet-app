const STORAGE_KEY = "corb-fleet-manager-state-v2";
const OLD_STORAGE_KEY = "fleetops-manager-state";

const today = new Date();
const todayIso = isoDate(today);

const lucidePaths = {
  clipboardList: `<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>`,
  gauge: `<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/><path d="M12 20h.01"/>`,
  truck: `<path d="M14 18V6a2 2 0 0 0-2-2H3v14h2"/><path d="M15 18H9"/><path d="M19 18h2v-6l-3-4h-4"/><path d="M2 9h12"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>`,
  search: `<path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>`,
  calendar: `<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>`,
  wrench: `<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.1-3.1a6 6 0 0 1-7.6 7.6l-6.7 6.7a2.1 2.1 0 0 1-3-3l6.7-6.7a6 6 0 0 1 7.6-7.6z"/>`,
  engine: `<path d="M3 10h4l2-3h4l2 3h3a3 3 0 0 1 3 3v3h-3l-2 3H8l-2-3H3z"/><path d="M7 10V7"/><path d="M10 7h4"/><path d="M14 10v9"/><path d="M3 14H1"/><path d="M21 14h2"/>`,
  arrowRight: `<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>`,
  chevronRight: `<path d="m9 18 6-6-6-6"/>`,
  arrowLeft: `<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>`,
  plus: `<path d="M5 12h14"/><path d="M12 5v14"/>`,
  check: `<path d="M20 6 9 17l-5-5"/>`,
  userRound: `<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>`,
  x: `<path d="M18 6 6 18"/><path d="m6 6 12 12"/>`,
  pencil: `<path d="M21.17 6.83a2.83 2.83 0 0 0-4-4L4 16v4h4z"/><path d="m15 5 4 4"/>`,
  lock: `<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>`,
  trash: `<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="m19 6-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>`,
  mail: `<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-10 6L2 7"/>`,
  folder: `<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>`,
  history: `<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>`,
  logOut: `<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>`
};

function icon(name, className = "icon") {
  return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true">${lucidePaths[name]}</svg>`;
}

const icons = {
  services: icon("clipboardList", "tab-icon"),
  gauge: icon("gauge", "tab-icon"),
  truck: icon("truck", "tab-icon"),
  search: icon("search", "icon"),
  calendar: icon("calendar", "icon"),
  wrench: icon("wrench", "card-icon"),
  engine: icon("engine", "icon"),
  arrowRight: icon("arrowRight", "icon"),
  chevronRight: icon("chevronRight", "icon"),
  back: icon("arrowLeft", "icon"),
  plus: icon("plus", "icon"),
  check: icon("check", "icon"),
  profile: icon("userRound", "icon"),
  x: icon("x", "icon"),
  edit: icon("pencil", "icon"),
  lock: icon("lock", "icon"),
  trash: icon("trash", "icon"),
  mail: icon("mail", "icon"),
  folder: icon("folder", "icon"),
  history: icon("history", "icon"),
  logout: icon("logOut", "icon")
};

const translations = {
  en: {
    fleetManager: "Fleet Manager",
    close: "Close",
    profile: "Profile",
    mainNavigation: "Main navigation",
    services: "Services",
    vehicles: "Vehicles",
    welcome: "Welcome",
    vehicleFleet: "Vehicle Fleet",
    manageVehicles: "Manage all vehicles in your fleet",
    searchServices: "Search services",
    noServicesMatch: "No services match this view.",
    all: "All",
    overdue: "Overdue",
    upcoming: "Upcoming",
    ok: "Ok",
    done: "Done",
    dueToday: "Due today",
    dueIn: "Due in {time}",
    overdueTasks: "Overdue<br />Tasks",
    upcomingTasks: "Upcoming<br />Tasks",
    noVehicleYet: "No vehicle yet",
    emptyVehicleCopy: "Add your first vehicle to start tracking maintenance schedules and service history",
    addVehicle: "Add vehicle",
    addService: "Add maintenance",
    create: "Create",
    createNew: "Create new",
    createVehicle: "Create vehicle",
    createService: "Add maintenance",
    serviceTitle: "Maintenance name",
    selectTruck: "Select truck",
    intervalDays: "Repeat days",
    intervalKm: "Repeat KM",
    dueDate: "First due date",
    dueKm: "First due KM",
    kilometers: "Kilometers",
    year: "Year",
    engineSerial: "Engine serial",
    filters: "Filters",
    noVehicleForService: "Create a vehicle before adding maintenance.",
    vehicleIdentity: "Vehicle identity",
    technicalInfo: "Technical info",
    maintenanceSetup: "Maintenance setup",
    completionWork: "Work completed",
    optional: "Optional",
    unknownVehicle: "Unknown vehicle",
    nextDue: "Next due",
    lastPerformed: "Last performed",
    markCompleted: "Mark as completed",
    maintenanceSchedules: "{count} maintenance schedules",
    backToVehicles: "Back to vehicles",
    back: "Back",
    title: "Title",
    unitNumber: "Unit Number",
    brandModel: "Brand/Model",
    timeBased: "Time based",
    maintenanceHistory: "Maintenance history",
    atMileage: "At mileage",
    service: "Service",
    details: "Details",
    schedule: "Schedule",
    history: "History",
    editTruck: "Edit truck",
    deleteTruck: "Delete truck",
    technicalDetails: "Technical details",
    engineBrandModel: "Engine Brand/Model",
    engineSerialNumber: "Engine Serial Number",
    filterPartNumbers: "Filter Part Numbers",
    noScheduledServices: "No scheduled services.",
    noCompletedHistory: "No completed service history.",
    profileTitle: "Profile",
    account: "Account",
    fleet: "Fleet",
    settings: "Settings",
    fleetPreferences: "Fleet preferences will live here.",
    activeFleet: "Active fleet",
    fleetName: "Fleet name",
    createFleet: "Create fleet",
    saveFleet: "Save fleet",
    switchFleet: "Switch fleet",
    vehiclesCount: "{count} vehicles",
    servicesCount: "{count} services",
    editProfile: "Edit profile",
    joined: "Joined",
    role: "Role",
    mechanic: "Mechanic",
    security: "Security",
    changePassword: "Change password",
    logout: "Logout",
    appearance: "Appearance",
    appearanceCopy: "Choose the visual mode that feels best for your workspace.",
    darkMode: "Dark mode",
    on: "On",
    off: "Off",
    language: "Language",
    languageCopy: "Switch the app interface between English and French.",
    english: "English",
    french: "French",
    notRecorded: "Not recorded",
    today: "Today",
    dayLate: "{count} day late",
    daysLate: "{count} days late",
    day: "{count} day",
    days: "{count} days",
    deleteVehicleConfirm: "Delete this vehicle and its services?",
    completionNotes: "Marked complete from mobile workflow.",
    oilChange: "Oil change",
    brakeInspection: "Brake inspection",
    annualInspection: "Annual inspection",
    every30Days: "Every 30 days",
    every60Days: "Every 60 days",
    every12Months: "Every 12 months",
    truckNumber: "Truck #{number}",
    timeAndKmBased: "Time + KM based",
    kmBased: "KM based",
    nextDueKm: "Next due KM",
    currentKm: "Current KM",
    remainingKm: "{count} km left",
    kmOverdue: "{count} km overdue",
    completionDetails: "Completion details",
    mechanicNote: "Mechanic note",
    mechanicNotePlaceholder: "Add work performed, issues found, or follow-up notes",
    partsNumbers: "Parts numbers",
    partsNumbersPlaceholder: "Filters, oil, brake parts, insurance or reference numbers",
    photosDocuments: "Photos & documents",
    photosDocumentsHint: "Photos, invoices, insurance files, inspection sheets",
    completed: "Completed",
    completedOn: "Completed on",
    note: "Note",
    lastCompletion: "Last completion",
    noCompletionYet: "No completion yet",
    completedBy: "Completed by",
    mechanicAccessCode: "Mechanic access code",
    scheduleRule: "Schedule rule",
    serviceSchedule: "Service schedule",
    completedServices: "Completed work",
    maintenanceOverview: "Maintenance overview",
    repeat: "Repeat",
    completeNow: "Complete",
    confirmCompletion: "Complete",
    cancel: "Cancel"
  },
  fr: {
    fleetManager: "Gestion de flotte",
    close: "Fermer",
    profile: "Profil",
    mainNavigation: "Navigation principale",
    services: "Services",
    vehicles: "Véhicules",
    welcome: "Bonjour",
    vehicleFleet: "Flotte de véhicules",
    manageVehicles: "Gérez tous les véhicules de votre flotte",
    searchServices: "Rechercher des services",
    noServicesMatch: "Aucun service ne correspond à cette vue.",
    all: "Tous",
    overdue: "En retard",
    upcoming: "À venir",
    ok: "Ok",
    done: "Terminé",
    dueToday: "À faire aujourd'hui",
    dueIn: "Dans {time}",
    overdueTasks: "Tâches<br />en retard",
    upcomingTasks: "Tâches<br />à venir",
    noVehicleYet: "Aucun véhicule",
    emptyVehicleCopy: "Ajoutez votre premier véhicule pour suivre les entretiens et l'historique des services",
    addVehicle: "Ajouter un véhicule",
    addService: "Ajouter un entretien",
    create: "Créer",
    createNew: "Créer",
    createVehicle: "Créer un véhicule",
    createService: "Ajouter un entretien",
    serviceTitle: "Nom de l'entretien",
    selectTruck: "Choisir un camion",
    intervalDays: "Répétition en jours",
    intervalKm: "Répétition en KM",
    dueDate: "Première échéance",
    dueKm: "Premier KM d'échéance",
    kilometers: "Kilométrage",
    year: "Année",
    engineSerial: "Série moteur",
    filters: "Filtres",
    noVehicleForService: "Créez un véhicule avant d'ajouter un entretien.",
    vehicleIdentity: "Identité du véhicule",
    technicalInfo: "Infos techniques",
    maintenanceSetup: "Configuration de l'entretien",
    completionWork: "Travail complété",
    optional: "Optionnel",
    unknownVehicle: "Véhicule inconnu",
    nextDue: "Prochaine échéance",
    lastPerformed: "Dernier service",
    markCompleted: "Marquer comme terminé",
    maintenanceSchedules: "{count} entretiens planifiés",
    backToVehicles: "Retour aux véhicules",
    back: "Retour",
    title: "Titre",
    unitNumber: "Numéro d'unité",
    brandModel: "Marque/modèle",
    timeBased: "Selon le temps",
    maintenanceHistory: "Historique d'entretien",
    atMileage: "Au kilométrage",
    service: "Service",
    details: "Détails",
    schedule: "Horaire",
    history: "Historique",
    editTruck: "Modifier le camion",
    deleteTruck: "Supprimer le camion",
    technicalDetails: "Détails techniques",
    engineBrandModel: "Marque/modèle du moteur",
    engineSerialNumber: "Numéro de série du moteur",
    filterPartNumbers: "Numéros de pièces des filtres",
    noScheduledServices: "Aucun service planifié.",
    noCompletedHistory: "Aucun historique de service terminé.",
    profileTitle: "Profil",
    account: "Compte",
    fleet: "Flotte",
    settings: "Réglages",
    fleetPreferences: "Les préférences de flotte seront ici.",
    activeFleet: "Flotte active",
    fleetName: "Nom de la flotte",
    createFleet: "Créer une flotte",
    saveFleet: "Enregistrer",
    switchFleet: "Changer de flotte",
    vehiclesCount: "{count} véhicules",
    servicesCount: "{count} services",
    editProfile: "Modifier le profil",
    joined: "Inscrit",
    role: "Rôle",
    mechanic: "Mécanicien",
    security: "Sécurité",
    changePassword: "Changer le mot de passe",
    logout: "Déconnexion",
    appearance: "Apparence",
    appearanceCopy: "Choisissez le mode visuel le plus confortable pour votre espace de travail.",
    darkMode: "Mode sombre",
    on: "Activé",
    off: "Désactivé",
    language: "Langue",
    languageCopy: "Basculez l'interface entre le français et l'anglais.",
    english: "Anglais",
    french: "Français",
    notRecorded: "Non enregistré",
    today: "Aujourd'hui",
    dayLate: "{count} jour de retard",
    daysLate: "{count} jours de retard",
    day: "{count} jour",
    days: "{count} jours",
    deleteVehicleConfirm: "Supprimer ce véhicule et ses services?",
    completionNotes: "Marqué comme terminé depuis le flux mobile.",
    oilChange: "Changement d'huile",
    brakeInspection: "Inspection des freins",
    annualInspection: "Inspection annuelle",
    every30Days: "Tous les 30 jours",
    every60Days: "Tous les 60 jours",
    every12Months: "Tous les 12 mois",
    truckNumber: "Camion no {number}",
    timeAndKmBased: "Selon le temps + KM",
    kmBased: "Selon les KM",
    nextDueKm: "Prochaine échéance KM",
    currentKm: "KM actuel",
    remainingKm: "{count} km restants",
    kmOverdue: "{count} km en retard",
    completionDetails: "Détails de complétion",
    mechanicNote: "Note du mécanicien",
    mechanicNotePlaceholder: "Ajoutez le travail effectué, les problèmes trouvés ou les suivis",
    partsNumbers: "Numéros de pièces",
    partsNumbersPlaceholder: "Filtres, huile, freins, assurance ou numéros de référence",
    photosDocuments: "Photos et documents",
    photosDocumentsHint: "Photos, factures, assurances, fiches d'inspection",
    completed: "Complété",
    completedOn: "Complété le",
    note: "Note",
    lastCompletion: "Dernière complétion",
    noCompletionYet: "Aucune complétion",
    completedBy: "Complété par",
    mechanicAccessCode: "Code d'accès mécanicien",
    scheduleRule: "Règle de planification",
    serviceSchedule: "Horaire de service",
    completedServices: "Travaux complétés",
    maintenanceOverview: "Aperçu de l'entretien",
    repeat: "Répétition",
    completeNow: "Compléter",
    confirmCompletion: "Compléter",
    cancel: "Annuler"
  }
};

const app = document.querySelector("#app");
let state = loadState();
let chromeHidden = false;
let lastScrollY = window.scrollY;
let scrollTicking = false;
let touchStartY = 0;
applyInitialUrlRoute();

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function formatDate(value) {
  if (!value) return t("notRecorded");
  return new Intl.DateTimeFormat(dateLocale(), {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date(`${value}T00:00:00`));
}

function shortDate(value) {
  if (!value) return t("notRecorded");
  return new Intl.DateTimeFormat(dateLocale(), {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(`${value}T00:00:00`));
}

function formatKm(value) {
  return `${Number(value || 0).toLocaleString(dateLocale())} km`;
}

function t(key, replacements = {}) {
  const template = translations[state?.language || "en"]?.[key] ?? translations.en[key] ?? key;
  return Object.entries(replacements).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, value),
    template
  );
}

function dateLocale() {
  return state?.language === "fr" ? "fr-CA" : "en-US";
}

function addDays(days) {
  const date = new Date(today);
  date.setDate(date.getDate() + days);
  return isoDate(date);
}

function uid(prefix) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function defaultState() {
  return {
    route: "services",
    previousRoute: "services",
    activeFleetId: "fleet-1",
    activeServiceId: null,
    activeVehicleId: null,
    createMenuOpen: false,
    completionModalServiceId: null,
    serviceFilter: "all",
    serviceSearch: "",
    profileTab: "account",
    truckTab: "details",
    theme: "light",
    language: "en",
    user: {
      firstName: "Anthony",
      displayName: "Anthony.Corbin",
      email: "Anthony_1997@gmail.com",
      role: "Mechanic",
      joinedAt: "2025-10-10"
    },
    fleets: [
      {
        id: "fleet-1",
        name: "CORB Fleet",
        ownerUserId: "user-1",
        mechanicAccessCode: "2468"
      }
    ],
    mechanicAccessCodes: [
      {
        id: "access-1",
        fleetId: "fleet-1",
        code: "2468",
        role: "mechanic",
        active: true
      }
    ],
    vehicles: [
      {
        id: "vehicle-1",
        fleetId: "fleet-1",
        title: "Truck #1",
        unitNumber: "M12",
        brandModel: "Mercedes - B40",
        year: "2025",
        kilometers: 99997,
        technical: {
          engineBrandModel: "TX-500",
          engineSerialNumber: "E241242",
          filterPartNumbers: "F42141"
        },
        createdAt: new Date().toISOString()
      },
      {
        id: "vehicle-2",
        fleetId: "fleet-1",
        title: "Truck #2",
        unitNumber: "M13",
        brandModel: "Mercedes - B40",
        year: "2014",
        kilometers: 1255969,
        technical: {
          engineBrandModel: "TX-540",
          engineSerialNumber: "E991420",
          filterPartNumbers: "F42141, A140"
        },
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: "vehicle-3",
        fleetId: "fleet-1",
        title: "Truck #3",
        unitNumber: "M14",
        brandModel: "Mercedes - B40",
        year: "2014",
        kilometers: 875430,
        technical: {
          engineBrandModel: "TX-540",
          engineSerialNumber: "E775302",
          filterPartNumbers: "F42141"
        },
        createdAt: new Date(Date.now() - 172800000).toISOString()
      }
    ],
    maintenancePlans: [
      {
        id: "service-1",
        fleetId: "fleet-1",
        vehicleId: "vehicle-1",
        title: "Changement d’huile",
        scheduleType: "hybrid",
        recurrenceType: "hybrid",
        recurrenceLabel: "Every 30 days",
        intervalDays: 30,
        intervalKm: 10000,
        dueDate: addDays(1),
        dueKm: 109920,
        warningDays: 7,
        warningKm: 1000,
        status: "active"
      },
      {
        id: "service-2",
        fleetId: "fleet-1",
        vehicleId: "vehicle-1",
        title: "Brake inspection",
        scheduleType: "time",
        recurrenceType: "time",
        recurrenceLabel: "Every 60 days",
        intervalDays: 60,
        intervalKm: null,
        dueDate: addDays(18),
        dueKm: null,
        warningDays: 14,
        warningKm: null,
        status: "active"
      },
      {
        id: "service-3",
        fleetId: "fleet-1",
        vehicleId: "vehicle-2",
        title: "Changement d’huile",
        scheduleType: "hybrid",
        recurrenceType: "hybrid",
        recurrenceLabel: "Every 30 days",
        intervalDays: 30,
        intervalKm: 10000,
        dueDate: addDays(-2),
        dueKm: 1261100,
        warningDays: 7,
        warningKm: 1000,
        status: "active"
      },
      {
        id: "service-4",
        fleetId: "fleet-1",
        vehicleId: "vehicle-2",
        title: "Annual inspection",
        scheduleType: "time",
        recurrenceType: "time",
        recurrenceLabel: "Every 12 months",
        intervalDays: 365,
        intervalKm: null,
        dueDate: addDays(30),
        dueKm: null,
        warningDays: 30,
        warningKm: null,
        status: "active"
      }
    ],
    serviceRecords: [
      {
        id: "completion-1",
        fleetId: "fleet-1",
        maintenancePlanId: "service-1",
        vehicleId: "vehicle-1",
        title: "Changement d’huile",
        completedAt: "2025-10-29T14:30:00.000Z",
        completedDate: "2025-10-29",
        completedKm: 99920,
        completedBy: "Anthony.Corbin",
        mechanicNote: "Oil and filter changed. No leak found.",
        partsNumbers: "F42141",
        attachmentNames: ["oil-filter-photo.jpg"]
      },
      {
        id: "completion-2",
        fleetId: "fleet-1",
        maintenancePlanId: "service-2",
        vehicleId: "vehicle-1",
        title: "Brake inspection",
        completedAt: "2025-10-10T10:15:00.000Z",
        completedDate: "2025-10-10",
        completedKm: 98200,
        completedBy: "Anthony.Corbin",
        mechanicNote: "Pads inspected and cleared for service.",
        partsNumbers: "",
        attachmentNames: ["brake-check.jpg"]
      },
      {
        id: "completion-3",
        fleetId: "fleet-1",
        maintenancePlanId: "service-3",
        vehicleId: "vehicle-2",
        title: "Changement d’huile",
        completedAt: "2025-10-29T13:00:00.000Z",
        completedDate: "2025-10-29",
        completedKm: 1251100,
        completedBy: "Anthony.Corbin",
        mechanicNote: "Oil service completed.",
        partsNumbers: "F42141",
        attachmentNames: []
      }
    ]
  };
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return normalizeState({
        ...defaultState(),
        ...parsed,
        maintenancePlans: parsed.maintenancePlans || parsed.serviceSchedules || parsed.services,
        serviceRecords: parsed.serviceRecords || parsed.serviceCompletions
      });
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  const old = localStorage.getItem(OLD_STORAGE_KEY);
  if (old) {
    try {
      return migrateOldState(JSON.parse(old));
    } catch {
      return normalizeState(defaultState());
    }
  }

  return normalizeState(defaultState());
}

function normalizeState(next) {
  if (next.theme !== "dark" && next.theme !== "light") next.theme = "light";
  if (next.language !== "fr" && next.language !== "en") next.language = "en";
  if (next.route === "dashboard") next.route = "services";
  if (next.previousRoute === "dashboard") next.previousRoute = "services";
  if (!next.activeFleetId) next.activeFleetId = "fleet-1";
  if (!next.fleets?.some?.((fleet) => fleet.id === next.activeFleetId)) next.activeFleetId = next.fleets?.[0]?.id || "fleet-1";
  next.createMenuOpen = false;
  next.completionModalServiceId = null;
  if (!["details", "schedule", "history"].includes(next.truckTab)) next.truckTab = "details";
  if (!Array.isArray(next.fleets)) next.fleets = defaultState().fleets;
  if (!Array.isArray(next.mechanicAccessCodes)) next.mechanicAccessCodes = defaultState().mechanicAccessCodes;
  if (Array.isArray(next.services) && !Array.isArray(next.maintenancePlans)) {
    next.maintenancePlans = next.services.map(normalizeMaintenancePlan);
  }
  if (!Array.isArray(next.maintenancePlans)) next.maintenancePlans = [];
  if (!Array.isArray(next.serviceRecords)) {
    next.serviceRecords = next.maintenancePlans
      .filter((schedule) => schedule.lastPerformedDate)
      .map(recordFromPlanSnapshot);
  }
  next.maintenancePlans = next.maintenancePlans.map(normalizeMaintenancePlan);
  next.serviceRecords = next.serviceRecords.map(normalizeServiceRecord);
  next.vehicles = (Array.isArray(next.vehicles) ? next.vehicles : []).map((vehicle) => ({
    ...vehicle,
    fleetId: vehicle.fleetId || next.activeFleetId
  }));
  delete next.services;
  delete next.serviceSchedules;
  delete next.serviceCompletions;
  return next;
}

function migrateOldState(old) {
  const next = defaultState();
  const vehicles = Array.isArray(old.vehicles) ? old.vehicles : [];
  const services = Array.isArray(old.services) ? old.services : [];

  next.vehicles = vehicles.map((vehicle, index) => ({
    id: vehicle.id || uid("vehicle"),
    fleetId: "fleet-1",
    title: vehicle.unit || `Truck #${index + 1}`,
    unitNumber: vehicle.unit || `M${index + 1}`,
    brandModel: vehicle.brand || "Mercedes - B40",
    year: "",
    kilometers: Number(vehicle.kilometers || 0),
    technical: {
      engineBrandModel: "TX-500",
      engineSerialNumber: "",
      filterPartNumbers: ""
    },
    createdAt: vehicle.createdAt || new Date().toISOString()
  }));

  next.maintenancePlans = services.map((service) => normalizeMaintenancePlan({
    id: service.id || uid("service"),
    vehicleId: service.vehicleId,
    title: service.type || "Changement d’huile",
    recurrenceType: "time",
    recurrenceLabel: "Every 30 days",
    dueDate: service.dueDate || todayIso,
    lastPerformedDate: service.completedAt ? isoDate(new Date(service.completedAt)) : "",
    lastPerformedKm: Number(service.completedKilometers || service.dueKilometers || 0),
    status: service.status === "completed" ? "completed" : "scheduled",
    completedAt: service.completedAt || null,
    completionNotes: service.completionNotes || ""
  }));
  next.serviceRecords = next.maintenancePlans
    .filter((schedule) => schedule.lastPerformedDate)
    .map(recordFromPlanSnapshot);

  return next;
}

function normalizeMaintenancePlan(plan) {
  const rule = plan.scheduleRule || {};
  const recurrenceLabel = plan.recurrenceLabel || "Every 30 days";
  const scheduleType = rule.type || plan.scheduleType || plan.recurrenceType || (plan.intervalKm || rule.intervalKm ? "hybrid" : "time");
  const intervalDays = Number(rule.intervalDays ?? plan.intervalDays ?? (recurrenceLabel === "Every 60 days" ? 60 : recurrenceLabel === "Every 12 months" ? 365 : 30));
  const intervalKm = rule.intervalKm === null || plan.intervalKm === null
    ? null
    : rule.intervalKm !== undefined
      ? Number(rule.intervalKm)
      : plan.intervalKm !== undefined
        ? Number(plan.intervalKm)
        : (scheduleType === "km" || scheduleType === "hybrid" ? 10000 : null);
  const warningDays = Number(rule.warningDays ?? plan.warningDays ?? 7);
  const warningKm = rule.warningKm === null || plan.warningKm === null
    ? null
    : rule.warningKm !== undefined
      ? Number(rule.warningKm)
      : plan.warningKm !== undefined
        ? Number(plan.warningKm)
        : (intervalKm ? 1000 : null);

  return {
    id: plan.id || uid("service"),
    fleetId: plan.fleetId || "fleet-1",
    vehicleId: plan.vehicleId,
    title: plan.title || t("oilChange"),
    category: plan.category || "maintenance",
    status: plan.status === "archived" || plan.status === "paused" ? plan.status : "active",
    recurrenceLabel,
    scheduleRule: {
      type: scheduleType,
      intervalDays,
      intervalKm,
      warningDays,
      warningKm
    },
    scheduleType,
    recurrenceType: scheduleType,
    intervalDays,
    intervalKm,
    dueDate: plan.dueDate || todayIso,
    dueKm: plan.dueKm === undefined ? (intervalKm ? Number(plan.lastPerformedKm || 0) + intervalKm : null) : plan.dueKm,
    warningDays,
    warningKm,
    createdAt: plan.createdAt || new Date().toISOString(),
    notes: plan.notes || ""
  };
}

function normalizeServiceRecord(record) {
  const maintenancePlanId = record.maintenancePlanId || record.scheduleId;
  return {
    id: record.id || uid("record"),
    fleetId: record.fleetId || "fleet-1",
    maintenancePlanId,
    vehicleId: record.vehicleId,
    title: record.title || "",
    completedAt: record.completedAt || `${record.completedDate || todayIso}T12:00:00.000Z`,
    completedDate: record.completedDate || (record.completedAt ? isoDate(new Date(record.completedAt)) : todayIso),
    completedKm: Number(record.completedKm || 0),
    completedBy: record.completedBy || "Anthony.Corbin",
    mechanicNote: record.mechanicNote || record.completionNotes || "",
    partsNumbers: record.partsNumbers || "",
    attachmentNames: Array.isArray(record.attachmentNames) ? record.attachmentNames : []
  };
}

function recordFromPlanSnapshot(schedule) {
  return normalizeServiceRecord({
    id: `completion-${schedule.id}`,
    fleetId: schedule.fleetId || "fleet-1",
    maintenancePlanId: schedule.id,
    vehicleId: schedule.vehicleId,
    title: schedule.title,
    completedAt: schedule.completedAt || `${schedule.lastPerformedDate || todayIso}T12:00:00.000Z`,
    completedDate: schedule.lastPerformedDate || todayIso,
    completedKm: Number(schedule.lastPerformedKm || 0),
    completedBy: "Anthony.Corbin",
    mechanicNote: schedule.completionNotes || "",
    partsNumbers: "",
    attachmentNames: []
  });
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function vehicleById(id) {
  return state.vehicles.find((vehicle) => vehicle.id === id);
}

function activeFleet() {
  return state.fleets.find((fleet) => fleet.id === state.activeFleetId) || state.fleets[0];
}

function vehiclesForActiveFleet() {
  return state.vehicles.filter((vehicle) => vehicle.fleetId === state.activeFleetId);
}

function maintenancePlanById(id) {
  return state.maintenancePlans.find((service) => service.id === id);
}

function latestServiceRecord(planId) {
  return recordsForPlan(planId)[0] || null;
}

function dueSummaryForPlan(plan) {
  const vehicle = vehicleById(plan.vehicleId);
  const record = latestServiceRecord(plan.id);
  const rule = plan.scheduleRule || {};
  const lastPerformedDate = record?.completedDate || plan.lastPerformedDate || "";
  const lastPerformedKm = Number(record?.completedKm ?? plan.lastPerformedKm ?? 0);
  const hasRecord = Boolean(record || plan.lastPerformedDate);
  const nextDueDate = hasRecord && rule.intervalDays ? addDaysToIso(lastPerformedDate, rule.intervalDays) : plan.dueDate;
  const nextDueKm = rule.intervalKm
    ? (hasRecord ? lastPerformedKm + Number(rule.intervalKm) : Number(plan.dueKm || Number(vehicle?.kilometers || 0) + Number(rule.intervalKm)))
    : null;
  const kmRemaining = nextDueKm ? nextDueKm - Number(vehicle?.kilometers || 0) : null;

  return {
    lastRecord: record,
    lastPerformedDate,
    lastPerformedKm,
    nextDueDate,
    nextDueKm,
    kmRemaining,
    dueText: nextDueKm ? `${relativeDue(nextDueDate)} / ${relativeKmValue(kmRemaining)}` : relativeDue(nextDueDate)
  };
}

function planStatus(service) {
  const summary = dueSummaryForPlan(service);
  const kmRemaining = summary.kmRemaining;
  if (summary.nextDueDate && summary.nextDueDate < todayIso) return "overdue";
  if (kmRemaining !== null && kmRemaining <= 0) return "overdue";
  if (summary.nextDueDate && daysUntil(summary.nextDueDate) <= Number(service.scheduleRule?.warningDays ?? service.warningDays ?? 7)) return "upcoming";
  if (kmRemaining !== null && kmRemaining <= Number(service.scheduleRule?.warningKm ?? service.warningKm ?? 1000)) return "upcoming";
  return "ok";
}

function plansForVehicle(vehicleId) {
  return state.maintenancePlans.filter((service) => service.vehicleId === vehicleId && service.status !== "archived");
}

function recordsForVehicle(vehicleId) {
  return state.serviceRecords
    .filter((completion) => completion.vehicleId === vehicleId)
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
}

function recordsForPlan(planId) {
  return state.serviceRecords
    .filter((completion) => completion.maintenancePlanId === planId || completion.scheduleId === planId)
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
}

function visibleServices() {
  const query = state.serviceSearch.trim().toLowerCase();
  return state.maintenancePlans.filter((service) => {
    const vehicle = vehicleById(service.vehicleId);
    const status = planStatus(service);
    const matchesFleet = service.fleetId === state.activeFleetId && service.status !== "archived";
    const matchesFilter = state.serviceFilter === "all" || state.serviceFilter === status;
    const haystack = `${service.title} ${displayServiceTitle(service)} ${vehicle?.title || ""} ${vehicle ? displayVehicleTitle(vehicle) : ""} ${vehicle?.brandModel || ""}`.toLowerCase();
    return matchesFleet && matchesFilter && (!query || haystack.includes(query));
  });
}

function statusCounts() {
  return state.maintenancePlans.filter((service) => service.fleetId === state.activeFleetId && service.status !== "archived").reduce(
    (counts, service) => {
      counts[planStatus(service)] += 1;
      return counts;
    },
    { overdue: 0, upcoming: 0, ok: 0 }
  );
}

function daysUntil(value) {
  const due = new Date(`${value}T00:00:00`);
  const now = new Date(`${todayIso}T00:00:00`);
  return Math.ceil((due - now) / 86400000);
}

function relativeDue(value) {
  const days = daysUntil(value);
  if (days < 0) return t(Math.abs(days) === 1 ? "dayLate" : "daysLate", { count: Math.abs(days) });
  if (days === 0) return t("today");
  return t(days === 1 ? "day" : "days", { count: days });
}

function kmUntil(service) {
  return dueSummaryForPlan(service).kmRemaining;
}

function relativeKm(service) {
  const km = kmUntil(service);
  if (km === null) return t("notRecorded");
  return relativeKmValue(km);
}

function relativeKmValue(km) {
  if (km < 0) return t("kmOverdue", { count: Math.abs(km).toLocaleString(dateLocale()) });
  return t("remainingKm", { count: km.toLocaleString(dateLocale()) });
}

function addDaysToIso(value, days) {
  const date = new Date(`${value}T00:00:00`);
  date.setDate(date.getDate() + Number(days || 0));
  return isoDate(date);
}

function displayVehicleTitle(vehicle) {
  const match = /^Truck #(\d+)$/i.exec(vehicle?.title || "");
  return match ? t("truckNumber", { number: match[1] }) : vehicle?.title || "";
}

function displayServiceTitle(service) {
  const titles = {
    "Changement d’huile": "oilChange",
    "Changement d'huile": "oilChange",
    "Oil change": "oilChange",
    "Brake inspection": "brakeInspection",
    "Annual inspection": "annualInspection"
  };
  return t(titles[service?.title] || "", {}) || service?.title || "";
}

function displayRecurrenceLabel(value) {
  const labels = {
    "Every 30 days": "every30Days",
    "Every 60 days": "every60Days",
    "Every 12 months": "every12Months"
  };
  return t(labels[value] || "", {}) || value;
}

function displayRole(value) {
  return value === "Mechanic" ? t("mechanic") : value;
}

function navigate(route, options = {}) {
  state.previousRoute = state.route;
  state.route = route;
  state.createMenuOpen = false;
  Object.assign(state, options);
  setChromeHidden(false);
  lastScrollY = 0;
  window.scrollTo(0, 0);
  render();
}

function applyInitialUrlRoute() {
  const params = new URLSearchParams(window.location.search);
  const route = params.get("route");
  const allowedRoutes = new Set([
    "services",
    "vehicles",
    "profile",
    "addVehicle",
    "addService",
    "serviceDetails",
    "truckDetails"
  ]);

  if (route === "dashboard") state.route = "services";
  else if (allowedRoutes.has(route)) state.route = route;
  if (params.get("vehicle")) state.activeVehicleId = params.get("vehicle");
  if (params.get("service")) state.activeServiceId = params.get("service");
  if (params.get("profileTab")) state.profileTab = params.get("profileTab");
  if (["details", "schedule", "history"].includes(params.get("truckTab"))) state.truckTab = params.get("truckTab");
  if (params.get("theme") === "dark" || params.get("theme") === "light") state.theme = params.get("theme");
  if (params.get("language") === "fr" || params.get("language") === "en") state.language = params.get("language");
  if (params.get("completionModal")) state.completionModalServiceId = params.get("completionModal");
  if (params.get("createMenu") === "1") state.createMenuOpen = true;
}

function header({ close = false } = {}) {
  const action = close
    ? `<button class="icon-btn" type="button" data-route="${state.previousRoute || "services"}" aria-label="${escapeAttr(t("close"))}">${icons.x}</button>`
    : `<button class="icon-btn" type="button" data-route="profile" aria-label="${escapeAttr(t("profile"))}">${icons.profile}</button>`;

  return `
    <header class="brand-header">
      <div class="brand">
        <span class="brand-mark" aria-hidden="true"></span>
        <span class="brand-name"><strong>CORB</strong><span>${escapeHtml(t("fleetManager"))}</span></span>
      </div>
      ${action}
    </header>
  `;
}

function bottomNav(active) {
  return `
    <div class="nav-scrim" aria-hidden="true"></div>
    <nav class="bottom-nav" aria-label="${escapeAttr(t("mainNavigation"))}">
      ${navButton("services", t("services"), icons.services, active)}
      ${navButton("vehicles", t("vehicles"), icons.truck, active)}
    </nav>
    <button class="create-fab" type="button" data-toggle-create-menu aria-label="${escapeAttr(t("createNew"))}">
      ${icons.plus}
    </button>
  `;
}

function navButton(route, label, icon, active) {
  return `
    <button class="nav-tab ${active === route ? "active" : ""}" type="button" data-route="${route}">
      ${icon}
      <span>${label}</span>
    </button>
  `;
}

function createActionMenu() {
  if (!state.createMenuOpen) return "";
  return `
    <div class="create-menu-backdrop" data-close-create-menu role="presentation">
      <section class="create-menu" role="dialog" aria-modal="true" aria-label="${escapeAttr(t("createNew"))}">
        <div class="create-menu-head">
          <h2>${escapeHtml(t("createNew"))}</h2>
          <button class="icon-btn" type="button" data-close-create-menu-trigger aria-label="${escapeAttr(t("close"))}">${icons.x}</button>
        </div>
        <button class="create-option" type="button" data-route="addVehicle">
          <span>${icons.truck}</span>
          <strong>${escapeHtml(t("createVehicle"))}</strong>
          ${icons.chevronRight}
        </button>
        <button class="create-option" type="button" data-route="addService">
          <span>${icons.wrench}</span>
          <strong>${escapeHtml(t("createService"))}</strong>
          ${icons.chevronRight}
        </button>
      </section>
    </div>
  `;
}

function appTabs({ items, active, dataAttribute, className = "" }) {
  return `
    <div class="app-tabs ${className}" role="tablist">
      ${items.map(({ key, label }) => `
        <button
          class="app-tab ${active === key ? "active" : ""}"
          type="button"
          role="tab"
          aria-selected="${active === key}"
          ${dataAttribute}="${key}"
        >
          <span>${escapeHtml(label)}</span>
        </button>
      `).join("")}
    </div>
  `;
}

function formSection(title, fields) {
  return `
    <section class="form-card">
      <h2 class="form-section-title">${escapeHtml(title)}</h2>
      <div class="form-stack">${fields}</div>
    </section>
  `;
}

function formField({ label, name, id = name, type = "text", value = "", required = false, inputmode = "", autocomplete = "off", options = null, hint = "", attrs = "" }) {
  const requiredAttr = required ? "required" : "";
  const inputmodeAttr = inputmode ? `inputmode="${escapeAttr(inputmode)}"` : "";
  const autocompleteAttr = autocomplete ? `autocomplete="${escapeAttr(autocomplete)}"` : "";
  const control = options
    ? `<select id="${escapeAttr(id)}" name="${escapeAttr(name)}" ${requiredAttr} ${attrs}>${options}</select>`
    : `<input id="${escapeAttr(id)}" name="${escapeAttr(name)}" type="${escapeAttr(type)}" value="${escapeAttr(value)}" ${requiredAttr} ${inputmodeAttr} ${autocompleteAttr} ${attrs} />`;

  return `
    <div class="form-field">
      <label for="${escapeAttr(id)}">${escapeHtml(label)}${required ? "" : `<span>${escapeHtml(t("optional"))}</span>`}</label>
      ${control}
      ${hint ? `<small>${escapeHtml(hint)}</small>` : ""}
    </div>
  `;
}

function metricCards(counts = statusCounts(), options = {}) {
  const overdueLabel = options.compact ? t("overdue") : t("overdueTasks");
  const upcomingLabel = options.compact ? t("upcoming") : t("upcomingTasks");

  return `
    <div class="metric-grid">
      <article class="metric-card">
        <span class="metric-rule red"></span>
        <span class="metric-label">${overdueLabel}</span>
        <strong class="metric-value">${counts.overdue}</strong>
      </article>
      <article class="metric-card">
        <span class="metric-rule yellow"></span>
        <span class="metric-label">${upcomingLabel}</span>
        <strong class="metric-value">${counts.upcoming}</strong>
      </article>
    </div>
  `;
}

function emptyVehicleCard() {
  return `
    <article class="empty-card">
      <div class="empty-content">
        <span class="empty-icon">${icons.truck}</span>
        <h2 class="empty-title">${escapeHtml(t("noVehicleYet"))}</h2>
        <p class="empty-copy">${escapeHtml(t("emptyVehicleCopy"))}</p>
        <button class="primary-btn" type="button" data-route="addVehicle">
          ${escapeHtml(t("addVehicle"))}
          <span class="button-icon-box">${icons.plus}</span>
        </button>
      </div>
    </article>
  `;
}

function renderDashboard() {
  const vehicles = vehiclesForActiveFleet();
  const hasVehicles = vehicles.length > 0;
  const firstUpcoming = state.maintenancePlans.find((service) => service.fleetId === state.activeFleetId && service.status !== "archived" && planStatus(service) === "upcoming");

  return `
    <div class="screen">
      ${header()}
      <section class="dashboard-content">
        <div class="screen-heading">
          <h1 class="screen-title">${escapeHtml(t("welcome"))}<br />${escapeHtml(state.user.firstName)},</h1>
        </div>
        ${metricCards()}
        ${
          hasVehicles
            ? `<div class="list-stack">${firstUpcoming ? serviceCard(firstUpcoming) : vehicleCard(vehicles[0])}</div>`
            : emptyVehicleCard()
        }
      </section>
      ${bottomNav("dashboard")}
    </div>
  `;
}

function renderServices() {
  const services = visibleServices();
  return `
    <div class="screen">
      ${header()}
      <section class="services-content">
        <div class="screen-heading tight">
          <h1 class="screen-title">${escapeHtml(t("welcome"))} ${escapeHtml(state.user.firstName)},</h1>
          <p class="screen-subtitle">${escapeHtml(t("services"))}</p>
        </div>
        <div>
          <div class="search-wrap">
            <label class="search-box">
              ${icons.search}
              <input value="${escapeAttr(state.serviceSearch)}" placeholder="" aria-label="${escapeAttr(t("searchServices"))}" data-service-search />
            </label>
          </div>
          ${filterRow()}
          <div class="list-stack">
            ${services.length ? services.map(serviceCard).join("") : `<div class="ghost-note">${escapeHtml(t("noServicesMatch"))}</div>`}
          </div>
        </div>
      </section>
      ${bottomNav("services")}
    </div>
  `;
}

function filterRow() {
  const counts = statusCounts();
  const filters = [
    ["all", t("all"), "", state.maintenancePlans.filter((service) => service.fleetId === state.activeFleetId && service.status !== "archived").length],
    ["overdue", t("overdue"), "overdue", counts.overdue],
    ["upcoming", t("upcoming"), "upcoming", counts.upcoming],
    ["ok", t("ok"), "ok", counts.ok]
  ];

  return `
    <div class="filter-row">
      ${filters.map(([key, label, tone, count]) => `
        <button class="filter-pill ${tone} ${state.serviceFilter === key ? "active" : ""}" type="button" data-filter="${key}">
          <span>${label}</span>
          <strong>${count}</strong>
        </button>
      `).join("")}
    </div>
  `;
}

function serviceCard(service) {
  const vehicle = vehicleById(service.vehicleId);
  const summary = dueSummaryForPlan(service);
  const status = planStatus(service);
  const dueDays = daysUntil(summary.nextDueDate);
  const dueChipLabel = status === "ok" ? t("ok") : status === "overdue" ? relativeDue(summary.nextDueDate) : dueDays === 0 ? t("dueToday") : t("dueIn", { time: relativeDue(summary.nextDueDate) });
  return `
    <article class="service-card click-card" data-open-service="${service.id}">
      <div class="service-card-body">
        <div class="service-head">
          <span>${icons.wrench}</span>
          <div>
            <h2 class="service-card-title">${escapeHtml(displayServiceTitle(service))}</h2>
            <button class="vehicle-link" type="button" data-open-vehicle="${service.vehicleId}">
              ${icons.truck}
              ${escapeHtml(vehicle ? displayVehicleTitle(vehicle) : t("unknownVehicle"))}
            </button>
          </div>
          <span class="due-chip ${status}">${escapeHtml(dueChipLabel)}</span>
          <span class="card-header-chevron" aria-hidden="true">${icons.chevronRight}</span>
        </div>
        <div class="service-dates">
          <div class="date-block">
            <span>${escapeHtml(t("nextDue"))}</span>
            <strong class="date-value">${icons.calendar}${formatDate(summary.nextDueDate)}</strong>
          </div>
          <div class="date-block">
            <span>${escapeHtml(t("lastPerformed"))}</span>
            <strong class="date-value">${icons.calendar}${summary.lastPerformedDate ? formatDate(summary.lastPerformedDate) : t("noCompletionYet")}</strong>
          </div>
        </div>
        <div class="service-actions"><button class="success-btn wide" type="button" data-complete-service="${service.id}">${escapeHtml(t("completeNow"))} ${icons.check}</button></div>
      </div>
    </article>
  `;
}

function serviceOverviewCard(service, vehicle) {
  const summary = dueSummaryForPlan(service);
  const status = planStatus(service);
  const scheduleLabel = service.scheduleType === "hybrid" ? t("timeAndKmBased") : service.scheduleType === "km" ? t("kmBased") : t("timeBased");
  return `
    <article class="detail-card service-overview-card">
      <div class="section-card-head">
        <h3>${icons.calendar} ${escapeHtml(t("maintenanceOverview"))}</h3>
        <span class="due-chip ${status}">${escapeHtml(status === "ok" ? t("ok") : status === "overdue" ? t("overdue") : t("upcoming"))}</span>
      </div>
      <div class="object-detail-grid">
        <div><span class="detail-label">${escapeHtml(t("nextDue"))}</span><strong class="date-value">${icons.calendar}${shortDate(summary.nextDueDate)}</strong></div>
        <div><span class="detail-label">${escapeHtml(t("nextDueKm"))}</span><strong class="date-value">${icons.gauge}${summary.nextDueKm ? formatKm(summary.nextDueKm) : t("notRecorded")}</strong></div>
        <div><span class="detail-label">${escapeHtml(t("lastPerformed"))}</span><strong>${summary.lastPerformedDate ? shortDate(summary.lastPerformedDate) : t("noCompletionYet")}</strong></div>
        <div><span class="detail-label">${escapeHtml(t("currentKm"))}</span><strong>${vehicle ? formatKm(vehicle.kilometers) : t("notRecorded")}</strong></div>
        <div><span class="detail-label">${escapeHtml(t("repeat"))}</span><strong>${escapeHtml(`${scheduleLabel} · ${displayRecurrenceLabel(service.recurrenceLabel)}`)}</strong></div>
        <div><span class="detail-label">${escapeHtml(t("details"))}</span><strong>${escapeHtml(summary.dueText)}</strong></div>
      </div>
    </article>
  `;
}

function serviceCompletionHistory(service) {
  const completions = recordsForPlan(service.id);
  return `
    <section class="service-history-section">
      <div class="section-title-row">
        <h3>${icons.history} ${escapeHtml(t("completedServices"))}</h3>
        <span>${completions.length}</span>
      </div>
      <div class="list-stack">
        ${completions.length ? completions.map((completion) => completionCard(completion, { showVehicle: false })).join("") : `<div class="ghost-note">${escapeHtml(t("noCompletedHistory"))}</div>`}
      </div>
    </section>
  `;
}

function completionCard(completion, { showVehicle = true } = {}) {
  const vehicle = vehicleById(completion.vehicleId);
  return `
    <article class="service-card completion-card">
      <div class="service-card-body">
        <div class="service-head compact-head">
          <span>${icons.history}</span>
          <div>
            <h2 class="service-card-title">${escapeHtml(displayServiceTitle(completion))}</h2>
            ${showVehicle ? `<div class="vehicle-link static-link">
              ${icons.truck}
              ${escapeHtml(vehicle ? displayVehicleTitle(vehicle) : t("unknownVehicle"))}
            </div>` : ""}
          </div>
          <span class="due-chip completed">${escapeHtml(t("completed"))}</span>
        </div>
        <div class="completion-record-grid">
          <div class="date-block">
            <span>${escapeHtml(t("completedOn"))}</span>
            <strong class="date-value">${icons.calendar}${formatDate(completion.completedDate)}</strong>
          </div>
          <div class="date-block">
            <span>${escapeHtml(t("atMileage"))}</span>
            <strong class="date-value">${icons.gauge}${formatKm(completion.completedKm)}</strong>
          </div>
        </div>
        ${completion.mechanicNote ? `<div class="completion-note-block"><span>${escapeHtml(t("mechanicNote"))}</span><p>${escapeHtml(completion.mechanicNote)}</p></div>` : ""}
      </div>
    </article>
  `;
}

function renderVehicles() {
  const vehicles = [...vehiclesForActiveFleet()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return `
    <div class="screen">
      ${header()}
      <section class="vehicles-content">
        <div class="screen-heading">
          <h1 class="screen-title">${escapeHtml(t("vehicleFleet"))}</h1>
          <p class="screen-subtitle">${escapeHtml(t("manageVehicles"))}</p>
        </div>
        ${
          vehicles.length
            ? `<div class="list-stack desktop-grid">${vehicles.map(vehicleCard).join("")}</div>`
            : emptyVehicleCard()
        }
      </section>
      ${bottomNav("vehicles")}
    </div>
  `;
}

function vehicleCard(vehicle) {
  const scheduledServices = plansForVehicle(vehicle.id);
  return `
    <article class="vehicle-card click-card" data-open-vehicle="${vehicle.id}">
      <div class="vehicle-card-body">
        <div class="vehicle-top">
          <span class="vehicle-head-icon">${icons.truck}</span>
          <div>
            <h2 class="vehicle-card-title">${escapeHtml(displayVehicleTitle(vehicle))}</h2>
            <div class="vehicle-model">${escapeHtml(modelLine(vehicle))}</div>
          </div>
          <span class="card-header-chevron" aria-hidden="true">${icons.chevronRight}</span>
        </div>
        <div class="vehicle-stats">
          <span class="vehicle-stat">${icons.gauge}${formatKm(vehicle.kilometers)}</span>
          <span class="vehicle-stat">${icons.wrench}${escapeHtml(t("maintenanceSchedules", { count: scheduledServices.length }))}</span>
        </div>
      </div>
    </article>
  `;
}

function modelLine(vehicle) {
  return `${vehicle.brandModel}${vehicle.year ? ` - ${vehicle.year}` : ""}`;
}

function renderAddVehicle() {
  return `
    <div class="screen with-actions">
      ${header()}
      <div class="back-row">
        <button class="icon-btn" type="button" data-route="vehicles" aria-label="${escapeAttr(t("backToVehicles"))}">${icons.back}</button>
        <div class="back-title">${escapeHtml(t("backToVehicles"))}</div>
      </div>
      <div class="form-page-head">
        <h1 class="form-title">${escapeHtml(t("addVehicle"))}</h1>
      </div>
      <form class="mobile-form" data-add-vehicle-form>
        ${formSection(t("vehicleIdentity"), `
          ${formField({ label: t("title"), name: "title", required: true })}
          ${formField({ label: t("unitNumber"), name: "unitNumber", required: true })}
          ${formField({ label: t("brandModel"), name: "brandModel", required: true })}
          <div class="form-grid two">
            ${formField({ label: t("year"), name: "year", inputmode: "numeric" })}
            ${formField({ label: t("kilometers"), name: "kilometers", type: "number", inputmode: "numeric", value: "0", attrs: 'min="0"' })}
          </div>
        `)}
        ${formSection(t("technicalInfo"), `
          ${formField({ label: t("engineBrandModel"), name: "engineBrandModel" })}
          ${formField({ label: t("engineSerial"), name: "engineSerialNumber" })}
          ${formField({ label: t("filters"), name: "filterPartNumbers" })}
        `)}
      </form>
      <div class="action-bar">
        <button class="success-btn wide" type="submit" form="unused" data-submit-add-vehicle>${escapeHtml(t("addVehicle"))} ${icons.check}</button>
        <button class="outline-btn wide" type="button" data-route="vehicles">${escapeHtml(t("back"))}</button>
      </div>
    </div>
  `;
}

function renderAddService() {
  const vehicles = vehiclesForActiveFleet();
  return `
    <div class="screen with-actions">
      ${header()}
      <div class="back-row">
        <button class="icon-btn" type="button" data-route="services" aria-label="${escapeAttr(t("back"))}">${icons.back}</button>
        <div class="back-title">${escapeHtml(t("addService"))}</div>
      </div>
      <div class="form-page-head">
        <h1 class="form-title">${escapeHtml(t("createService"))}</h1>
      </div>
      ${vehicles.length ? `
        <form class="mobile-form" data-add-service-form>
          ${formSection(t("maintenanceSetup"), `
            ${formField({
              label: t("selectTruck"),
              name: "vehicleId",
              required: true,
              options: vehicles.map((vehicle) => `<option value="${escapeAttr(vehicle.id)}">${escapeHtml(displayVehicleTitle(vehicle))} - ${escapeHtml(modelLine(vehicle))}</option>`).join("")
            })}
            ${formField({ label: t("serviceTitle"), name: "title", value: t("oilChange"), required: true })}
            <div class="form-grid two">
              ${formField({ label: t("intervalDays"), name: "intervalDays", type: "number", inputmode: "numeric", value: "30", attrs: 'min="0"' })}
              ${formField({ label: t("intervalKm"), name: "intervalKm", type: "number", inputmode: "numeric", value: "10000", attrs: 'min="0"' })}
            </div>
            ${formField({ label: t("dueDate"), name: "dueDate", type: "date", value: addDays(30), required: true })}
          `)}
        </form>
      ` : `<div class="ghost-note">${escapeHtml(t("noVehicleForService"))}</div>`}
      <div class="action-bar">
        <button class="success-btn wide" type="submit" form="unused" data-submit-add-service ${vehicles.length ? "" : "disabled"}>${escapeHtml(t("addService"))} ${icons.check}</button>
        <button class="outline-btn wide" type="button" data-route="services">${escapeHtml(t("back"))}</button>
      </div>
    </div>
  `;
}

function renderServiceDetails() {
  const service = maintenancePlanById(state.activeServiceId) || state.maintenancePlans.find((plan) => plan.fleetId === state.activeFleetId && plan.status !== "archived");
  if (!service) return renderServices();
  const vehicle = vehicleById(service.vehicleId);

  return `
    <div class="screen with-actions">
      ${header()}
      <section class="truck-overview-header service-overview-header">
        <button class="detail-back-btn" type="button" data-route="services" aria-label="${escapeAttr(t("services"))}">
          ${icons.back}
          <span>${escapeHtml(t("services"))}</span>
        </button>
        <div class="truck-title-row service-title-row">
          <div class="truck-heading">
            <h1>${escapeHtml(displayServiceTitle(service))}</h1>
            <p>${icons.truck}${escapeHtml(vehicle ? displayVehicleTitle(vehicle) : t("unknownVehicle"))}</p>
          </div>
        </div>
      </section>
      ${serviceOverviewCard(service, vehicle)}
      ${serviceCompletionHistory(service)}
      <div class="action-bar">
        <button class="success-btn wide" type="button" data-complete-service="${service.id}">${escapeHtml(t("completeNow"))} ${icons.check}</button>
        <button class="outline-btn wide" type="button" data-route="services">${escapeHtml(t("back"))}</button>
      </div>
    </div>
  `;
}

function renderTruckDetails() {
  const vehicle = vehicleById(state.activeVehicleId) || vehiclesForActiveFleet()[0];
  if (!vehicle) return renderVehicles();
  const counts = plansForVehicle(vehicle.id).reduce(
    (acc, service) => {
      acc[planStatus(service)] += 1;
      return acc;
    },
    { overdue: 0, upcoming: 0, ok: 0 }
  );

  return `
    <div class="screen with-actions">
      ${header()}
      <section class="truck-overview-header">
        <button class="detail-back-btn" type="button" data-route="vehicles" aria-label="${escapeAttr(t("backToVehicles"))}">
          ${icons.back}
          <span>${escapeHtml(t("vehicles"))}</span>
        </button>
        <div class="truck-title-row">
          <div class="truck-heading">
            <h1>${escapeHtml(displayVehicleTitle(vehicle))}</h1>
            <p>${escapeHtml(modelLine(vehicle))}</p>
          </div>
          <div class="truck-header-actions">
            <button class="plain-icon-btn" type="button" aria-label="${escapeAttr(t("editTruck"))}">${icons.edit}</button>
            <button class="plain-icon-btn danger-icon" type="button" data-delete-vehicle="${vehicle.id}" aria-label="${escapeAttr(t("deleteTruck"))}">${icons.trash}</button>
          </div>
        </div>
        ${truckTabs()}
      </section>
      ${state.truckTab === "schedule" ? `<div class="truck-metrics-shell">${metricCards(counts, { compact: true })}</div>` : ""}
      ${truckTabContent(vehicle)}
      <div class="action-bar single-action">
        <button class="primary-btn wide" type="button" data-route="services">${escapeHtml(t("service"))} ${icons.wrench}</button>
      </div>
    </div>
  `;
}

function truckTabs() {
  return appTabs({
    items: [
      { key: "details", label: t("details") },
      { key: "schedule", label: t("schedule") },
      { key: "history", label: t("history") }
    ],
    active: state.truckTab,
    dataAttribute: "data-truck-tab",
    className: "truck-tabs full-bleed-tabs"
  });
}

function truckTabContent(vehicle) {
  if (state.truckTab === "schedule") {
    const scheduled = plansForVehicle(vehicle.id);
    return `<div class="list-stack">${scheduled.length ? scheduled.map(serviceCard).join("") : `<div class="ghost-note">${escapeHtml(t("noScheduledServices"))}</div>`}</div>`;
  }

  if (state.truckTab === "history") {
    const history = recordsForVehicle(vehicle.id);
    return `<div class="list-stack">${history.length ? history.map(completionCard).join("") : `<div class="ghost-note">${escapeHtml(t("noCompletedHistory"))}</div>`}</div>`;
  }

  return `
    <article class="technical-card">
      <div class="technical-head">
        <h3><span class="technical-title-icon">${icons.engine}</span>${escapeHtml(t("technicalDetails"))}</h3>
      </div>
      <div class="technical-list">
        <div><span class="detail-label">${escapeHtml(t("unitNumber"))}</span><strong>${escapeHtml(vehicle.unitNumber)}</strong></div>
        <div><span class="detail-label">${escapeHtml(t("engineBrandModel"))}</span><strong>${escapeHtml(vehicle.technical.engineBrandModel)}</strong></div>
        <div><span class="detail-label">${escapeHtml(t("engineSerialNumber"))}</span><strong>${escapeHtml(vehicle.technical.engineSerialNumber)}</strong></div>
        <div><span class="detail-label">${escapeHtml(t("filterPartNumbers"))}</span><strong>${escapeHtml(vehicle.technical.filterPartNumbers)}</strong></div>
      </div>
    </article>
  `;
}

function renderProfile() {
  return `
    <div class="screen">
      ${header({ close: true })}
      <h1 class="profile-title">${escapeHtml(t("profileTitle"))}</h1>
      ${appTabs({
        items: [
          { key: "account", label: t("account") },
          { key: "fleet", label: t("fleet") },
          { key: "settings", label: t("settings") }
        ],
        active: state.profileTab,
        dataAttribute: "data-profile-tab",
        className: "profile-tabs full-bleed-tabs"
      })}
      ${profileContent()}
    </div>
  `;
}

function profileContent() {
  if (state.profileTab === "fleet") return renderFleetPanel();
  if (state.profileTab === "settings") return renderSettingsPanel();

  return `
    <article class="profile-card">
      <div class="account-row">
        <span class="avatar" aria-hidden="true"></span>
        <div class="account-main">
          <div class="account-name">${escapeHtml(state.user.displayName)}</div>
          <div class="account-email">${icons.mail}${escapeHtml(state.user.email)}</div>
        </div>
        <button class="plain-icon-btn account-edit" type="button" aria-label="${escapeAttr(t("editProfile"))}">${icons.edit}</button>
      </div>
      <div class="profile-grid">
        <div><span class="detail-label">${escapeHtml(t("joined"))}</span><strong>${formatDate(state.user.joinedAt)}</strong></div>
        <div><span class="detail-label">${escapeHtml(t("role"))}</span><strong>${escapeHtml(displayRole(state.user.role))}</strong></div>
      </div>
    </article>
    <article class="profile-card security-card">
      <h2 class="security-title">${icons.lock} ${escapeHtml(t("security"))}</h2>
      <button class="outline-btn wide" type="button">${escapeHtml(t("changePassword"))}</button>
      <button class="danger-btn wide" type="button">${escapeHtml(t("logout"))} ${icons.logout}</button>
    </article>
  `;
}

function renderFleetPanel() {
  const fleets = state.fleets;
  return `
    <div class="fleet-panel">
      ${fleets.map((fleet) => {
        const vehicleCount = state.vehicles.filter((vehicle) => vehicle.fleetId === fleet.id).length;
        const serviceCount = state.maintenancePlans.filter((service) => service.fleetId === fleet.id && service.status !== "archived").length;
        const active = fleet.id === state.activeFleetId;
        return `
          <article class="profile-card fleet-card ${active ? "active" : ""}">
            <div class="fleet-card-head">
              <div>
                <span class="detail-label">${active ? escapeHtml(t("activeFleet")) : escapeHtml(t("fleet"))}</span>
                <strong>${escapeHtml(fleet.name)}</strong>
              </div>
              ${active ? "" : `<button class="outline-btn small-btn" type="button" data-switch-fleet="${fleet.id}">${escapeHtml(t("switchFleet"))}</button>`}
            </div>
            <div class="fleet-meta">
              <span>${escapeHtml(t("vehiclesCount", { count: vehicleCount }))}</span>
              <span>${escapeHtml(t("servicesCount", { count: serviceCount }))}</span>
            </div>
            <form class="fleet-name-form" data-fleet-name-form="${fleet.id}">
              ${formField({ label: t("fleetName"), name: "name", id: `fleetName-${fleet.id}`, value: fleet.name, required: true })}
              <button class="primary-btn compact-btn" type="submit">${escapeHtml(t("saveFleet"))}</button>
            </form>
          </article>
        `;
      }).join("")}
      <article class="profile-card fleet-card">
        <form class="fleet-name-form" data-create-fleet-form>
          ${formField({ label: t("fleetName"), name: "name", id: "newFleetName", required: true, attrs: `placeholder="${escapeAttr(t("fleetName"))}"` })}
          <button class="primary-btn compact-btn" type="submit">${escapeHtml(t("createFleet"))} ${icons.plus}</button>
        </form>
      </article>
    </div>
  `;
}

function renderSettingsPanel() {
  const darkMode = state.theme === "dark";
  const language = state.language === "fr" ? "fr" : "en";
  return `
    <article class="profile-card settings-card">
      <div class="settings-section">
        <h2 class="security-title">${icons.gauge} ${escapeHtml(t("appearance"))}</h2>
        <p class="settings-copy">${escapeHtml(t("appearanceCopy"))}</p>
      </div>
      <button class="setting-row" type="button" data-toggle-theme aria-pressed="${darkMode}">
        <span>
          <strong>${escapeHtml(t("darkMode"))}</strong>
          <small>${darkMode ? t("on") : t("off")}</small>
        </span>
        <span class="switch ${darkMode ? "on" : ""}" aria-hidden="true"><span></span></span>
      </button>
      <div class="settings-section">
        <h2 class="security-title compact">${icons.services} ${escapeHtml(t("language"))}</h2>
        <p class="settings-copy">${escapeHtml(t("languageCopy"))}</p>
      </div>
      <div class="language-toggle" role="group" aria-label="${escapeAttr(t("language"))}">
        <button class="${language === "en" ? "active" : ""}" type="button" data-language="en">${escapeHtml(t("english"))}</button>
        <button class="${language === "fr" ? "active" : ""}" type="button" data-language="fr">${escapeHtml(t("french"))}</button>
      </div>
    </article>
  `;
}

function completionModal() {
  const service = maintenancePlanById(state.completionModalServiceId);
  if (!service) return "";
  const vehicle = vehicleById(service.vehicleId);
  const summary = dueSummaryForPlan(service);

  return `
    <div class="modal-backdrop" data-close-modal role="presentation">
      <section class="completion-modal" role="dialog" aria-modal="true" aria-labelledby="completion-modal-title" data-modal-panel>
        <div class="modal-head">
          <div>
            <h2 id="completion-modal-title">${escapeHtml(t("completeNow"))}</h2>
            <p>${escapeHtml(displayServiceTitle(service))} · ${escapeHtml(vehicle ? displayVehicleTitle(vehicle) : t("unknownVehicle"))}</p>
          </div>
          <button class="icon-btn" type="button" data-close-modal-trigger aria-label="${escapeAttr(t("cancel"))}">${icons.x}</button>
        </div>
        <form class="completion-form" data-completion-form="${service.id}">
          <section class="form-card">
            <h2 class="form-section-title">${escapeHtml(t("completionWork"))}</h2>
            <div class="form-stack">
              ${formField({ label: t("currentKm"), name: "completedKm", type: "number", inputmode: "numeric", value: vehicle?.kilometers || summary.lastPerformedKm || 0, attrs: 'min="0"' })}
              <div class="form-field">
                <label for="mechanicNote">${escapeHtml(t("mechanicNote"))}<span>${escapeHtml(t("optional"))}</span></label>
                <textarea id="mechanicNote" name="mechanicNote" rows="4" placeholder="${escapeAttr(t("mechanicNotePlaceholder"))}"></textarea>
              </div>
              ${formField({ label: t("partsNumbers"), name: "partsNumbers", value: "", hint: t("partsNumbersPlaceholder") })}
              <div class="form-field">
                <label for="attachments">${escapeHtml(t("photosDocuments"))}<span>${escapeHtml(t("optional"))}</span></label>
                <input id="attachments" name="attachments" type="file" multiple />
                <small>${escapeHtml(t("photosDocumentsHint"))}</small>
              </div>
            </div>
          </section>
        </form>
        <div class="modal-actions">
          <button class="outline-btn wide" type="button" data-close-modal-trigger>${escapeHtml(t("cancel"))}</button>
          <button class="success-btn wide" type="button" data-submit-completion="${service.id}">${escapeHtml(t("confirmCompletion"))} ${icons.check}</button>
        </div>
      </section>
    </div>
  `;
}

function completeMaintenancePlan(serviceId, details = {}) {
  const service = maintenancePlanById(serviceId);
  if (!service) return;
  const vehicle = vehicleById(service.vehicleId);
  const summary = dueSummaryForPlan(service);
  const completedKm = Number(details.completedKm || vehicle?.kilometers || summary.lastPerformedKm || 0);
  const mechanicNote = details.mechanicNote || t("completionNotes");
  const attachmentNames = Array.isArray(details.attachmentNames) ? details.attachmentNames : [];
  const completedAt = new Date().toISOString();
  const completedDate = isoDate(new Date(completedAt));

  state.serviceRecords.unshift(normalizeServiceRecord({
    id: uid("record"),
    fleetId: service.fleetId || state.activeFleetId,
    maintenancePlanId: service.id,
    vehicleId: service.vehicleId,
    title: service.title,
    completedAt,
    completedDate,
    completedKm,
    completedBy: state.user.displayName,
    mechanicNote,
    partsNumbers: details.partsNumbers || "",
    attachmentNames
  }));

  if (vehicle && completedKm > Number(vehicle.kilometers || 0)) vehicle.kilometers = completedKm;
}

function completionFormValues(serviceId) {
  const form = app.querySelector(`[data-completion-form="${CSS.escape(serviceId)}"]`);
  if (!form) return {};
  const data = new FormData(form);
  const files = form.elements.attachments?.files ? Array.from(form.elements.attachments.files) : [];
  return {
    completedKm: Number(data.get("completedKm") || 0),
    mechanicNote: String(data.get("mechanicNote") || "").trim(),
    partsNumbers: String(data.get("partsNumbers") || "").trim(),
    attachmentNames: files.map((file) => file.name)
  };
}

function addVehicleFromForm(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  const nextNumber = state.vehicles.length + 1;
  state.vehicles.unshift({
    id: uid("vehicle"),
    fleetId: state.activeFleetId,
    title: data.title,
    unitNumber: data.unitNumber,
    brandModel: data.brandModel,
    year: data.year || "",
    kilometers: Number(data.kilometers || 0),
    technical: {
      engineBrandModel: data.engineBrandModel || "",
      engineSerialNumber: data.engineSerialNumber || "",
      filterPartNumbers: data.filterPartNumbers || ""
    },
    createdAt: new Date(Date.now() + nextNumber).toISOString()
  });
  navigate("vehicles");
}

function addMaintenancePlanFromForm(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  const vehicle = vehicleById(data.vehicleId);
  if (!vehicle) return;
  const intervalDays = Number(data.intervalDays || 0);
  const intervalKm = Number(data.intervalKm || 0);
  const scheduleType = intervalDays > 0 && intervalKm > 0 ? "hybrid" : intervalKm > 0 ? "km" : "time";
  const dueKm = intervalKm > 0 ? Number(vehicle.kilometers || 0) + intervalKm : 0;
  const service = normalizeMaintenancePlan({
    id: uid("service"),
    fleetId: vehicle.fleetId || state.activeFleetId,
    vehicleId: vehicle.id,
    title: data.title || t("oilChange"),
    scheduleType,
    recurrenceType: scheduleType,
    recurrenceLabel: intervalDays ? `Every ${intervalDays} days` : intervalKm ? `Every ${intervalKm.toLocaleString(dateLocale())} km` : "",
    intervalDays: scheduleType === "km" ? 0 : intervalDays,
    intervalKm: scheduleType === "time" ? null : intervalKm,
    dueDate: data.dueDate || todayIso,
    dueKm: scheduleType === "time" ? null : dueKm,
    warningDays: 7,
    warningKm: scheduleType === "time" ? null : 1000,
    status: "active"
  });
  state.maintenancePlans.unshift(service);
  navigate("serviceDetails", { activeServiceId: service.id });
}

function updateFleetName(form) {
  const fleetId = form.dataset.fleetNameForm;
  const fleet = state.fleets.find((item) => item.id === fleetId);
  if (!fleet) return;
  const data = new FormData(form);
  fleet.name = String(data.get("name") || fleet.name).trim() || fleet.name;
  render();
}

function createFleetFromForm(form) {
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  if (!name) return;
  const fleet = {
    id: uid("fleet"),
    name,
    ownerUserId: "user-1",
    mechanicAccessCode: String(Math.floor(1000 + Math.random() * 9000))
  };
  state.fleets.unshift(fleet);
  state.mechanicAccessCodes.unshift({
    id: uid("access"),
    fleetId: fleet.id,
    code: fleet.mechanicAccessCode,
    role: "mechanic",
    active: true
  });
  state.activeFleetId = fleet.id;
  render();
}

function render() {
  saveState();
  document.documentElement.dataset.theme = state.theme;
  document.documentElement.lang = state.language === "fr" ? "fr-CA" : "en";
  document.title = `CORB ${t("fleetManager")}`;
  document.documentElement.classList.toggle("chrome-hidden", chromeHidden);
  app.innerHTML = `
    <div class="app-shell ${state.theme === "dark" ? "theme-dark" : "theme-light"}">
      ${routeMarkup()}
      ${completionModal()}
      ${createActionMenu()}
    </div>
  `;
}

function routeMarkup() {
  if (state.route === "services") return renderServices();
  if (state.route === "vehicles") return renderVehicles();
  if (state.route === "profile") return renderProfile();
  if (state.route === "addVehicle") return renderAddVehicle();
  if (state.route === "addService") return renderAddService();
  if (state.route === "serviceDetails") return renderServiceDetails();
  if (state.route === "truckDetails") return renderTruckDetails();
  return renderServices();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll("\n", " ");
}

function setChromeHidden(hidden) {
  if (chromeHidden === hidden) return;
  chromeHidden = hidden;
  document.documentElement.classList.toggle("chrome-hidden", hidden);
}

function updateChromeForScroll() {
  const currentY = Math.max(0, window.scrollY);
  const delta = currentY - lastScrollY;

  if (currentY <= 12) {
    setChromeHidden(false);
  } else if (delta > 8) {
    setChromeHidden(true);
  } else if (delta < -20) {
    setChromeHidden(false);
  }

  lastScrollY = currentY;
  scrollTicking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(updateChromeForScroll);
  },
  { passive: true }
);

window.addEventListener(
  "wheel",
  (event) => {
    if (window.scrollY <= 12) {
      setChromeHidden(false);
    } else if (event.deltaY > 8) {
      setChromeHidden(true);
    } else if (event.deltaY < -8) {
      setChromeHidden(false);
    }
  },
  { passive: true }
);

window.addEventListener(
  "touchstart",
  (event) => {
    touchStartY = event.touches[0]?.clientY || 0;
  },
  { passive: true }
);

window.addEventListener(
  "touchmove",
  (event) => {
    const currentTouchY = event.touches[0]?.clientY || touchStartY;
    const touchDelta = touchStartY - currentTouchY;

    if (window.scrollY <= 12) {
      setChromeHidden(false);
    } else if (touchDelta > 8) {
      setChromeHidden(true);
    } else if (touchDelta < -8) {
      setChromeHidden(false);
    }

    touchStartY = currentTouchY;
  },
  { passive: true }
);

app.addEventListener("click", (event) => {
  const route = event.target.closest("[data-route]")?.dataset.route;
  const serviceId = event.target.closest("[data-open-service]")?.dataset.openService;
  const vehicleId = event.target.closest("[data-open-vehicle]")?.dataset.openVehicle;
  const completeId = event.target.closest("[data-complete-service]")?.dataset.completeMaintenancePlan;
  const submitCompletionId = event.target.closest("[data-submit-completion]")?.dataset.submitCompletion;
  const filter = event.target.closest("[data-filter]")?.dataset.filter;
  const profileTab = event.target.closest("[data-profile-tab]")?.dataset.profileTab;
  const truckTab = event.target.closest("[data-truck-tab]")?.dataset.truckTab;
  const deleteVehicleId = event.target.closest("[data-delete-vehicle]")?.dataset.deleteVehicle;
  const switchFleetId = event.target.closest("[data-switch-fleet]")?.dataset.switchFleet;
  const toggleCreateMenu = event.target.closest("[data-toggle-create-menu]");
  const closeCreateMenuTrigger = event.target.closest("[data-close-create-menu-trigger]");
  const closeCreateMenuBackdrop = event.target.matches("[data-close-create-menu]");
  const toggleTheme = event.target.closest("[data-toggle-theme]");
  const language = event.target.closest("[data-language]")?.dataset.language;
  const closeModalTrigger = event.target.closest("[data-close-modal-trigger]");
  const backdropClose = event.target.matches("[data-close-modal]");

  if (submitCompletionId) {
    completeMaintenancePlan(submitCompletionId, completionFormValues(submitCompletionId));
    state.completionModalServiceId = null;
    render();
    return;
  }
  if (completeId) {
    state.completionModalServiceId = completeId;
    render();
    return;
  }
  if (closeModalTrigger || backdropClose) {
    state.completionModalServiceId = null;
    render();
    return;
  }
  if (toggleCreateMenu) {
    state.createMenuOpen = !state.createMenuOpen;
    render();
    return;
  }
  if (closeCreateMenuTrigger || closeCreateMenuBackdrop) {
    state.createMenuOpen = false;
    render();
    return;
  }
  if (vehicleId) {
    navigate("truckDetails", { activeVehicleId: vehicleId, truckTab: "details" });
    return;
  }
  if (serviceId) {
    navigate("serviceDetails", { activeServiceId: serviceId });
    return;
  }
  if (route) {
    state.createMenuOpen = false;
    navigate(route);
    return;
  }
  if (switchFleetId) {
    state.activeFleetId = switchFleetId;
    render();
    return;
  }
  if (filter) {
    state.serviceFilter = filter;
    render();
  }
  if (profileTab) {
    state.profileTab = profileTab;
    render();
  }
  if (truckTab) {
    state.truckTab = truckTab;
    render();
  }
  if (toggleTheme) {
    state.theme = state.theme === "dark" ? "light" : "dark";
    render();
  }
  if (language === "en" || language === "fr") {
    state.language = language;
    render();
  }
  if (deleteVehicleId && confirm(t("deleteVehicleConfirm"))) {
    state.vehicles = state.vehicles.filter((vehicle) => vehicle.id !== deleteVehicleId);
    state.maintenancePlans = state.maintenancePlans.filter((service) => service.vehicleId !== deleteVehicleId);
    state.serviceRecords = state.serviceRecords.filter((completion) => completion.vehicleId !== deleteVehicleId);
    navigate("vehicles");
  }
});

app.addEventListener("input", (event) => {
  if (event.target.matches("[data-service-search]")) {
    state.serviceSearch = event.target.value;
    render();
  }
});

app.addEventListener("click", (event) => {
  if (event.target.closest("[data-submit-add-vehicle]")) {
    const form = app.querySelector("[data-add-vehicle-form]");
    if (form.reportValidity()) addVehicleFromForm(form);
  }
  if (event.target.closest("[data-submit-add-service]")) {
    const form = app.querySelector("[data-add-service-form]");
    if (form?.reportValidity()) addMaintenancePlanFromForm(form);
  }
});

app.addEventListener("submit", (event) => {
  if (event.target.matches("[data-add-vehicle-form]")) {
    event.preventDefault();
    addVehicleFromForm(event.target);
  }
  if (event.target.matches("[data-add-service-form]")) {
    event.preventDefault();
    addMaintenancePlanFromForm(event.target);
  }
  if (event.target.matches("[data-fleet-name-form]")) {
    event.preventDefault();
    updateFleetName(event.target);
  }
  if (event.target.matches("[data-create-fleet-form]")) {
    event.preventDefault();
    createFleetFromForm(event.target);
  }
});

render();

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
    lastCompletion: "Last completion",
    noCompletionYet: "No completion yet",
    completedBy: "Completed by",
    mechanicAccessCode: "Mechanic access code",
    scheduleRule: "Schedule rule",
    serviceSchedule: "Service schedule"
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
    lastCompletion: "Dernière complétion",
    noCompletionYet: "Aucune complétion",
    completedBy: "Complété par",
    mechanicAccessCode: "Code d'accès mécanicien",
    scheduleRule: "Règle de planification",
    serviceSchedule: "Horaire de service"
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
    serviceSchedules: [
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
        lastPerformedDate: "2025-10-29",
        lastPerformedKm: 99920,
        status: "scheduled",
        completedAt: null,
        completionNotes: ""
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
        lastPerformedDate: "2025-10-10",
        lastPerformedKm: 98200,
        status: "scheduled",
        completedAt: null,
        completionNotes: ""
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
        lastPerformedDate: "2025-10-29",
        lastPerformedKm: 1251100,
        status: "scheduled",
        completedAt: null,
        completionNotes: ""
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
        lastPerformedDate: "2025-05-11",
        lastPerformedKm: 1211000,
        status: "scheduled",
        completedAt: null,
        completionNotes: ""
      }
    ],
    serviceCompletions: [
      {
        id: "completion-1",
        fleetId: "fleet-1",
        scheduleId: "service-1",
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
        scheduleId: "service-2",
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
        scheduleId: "service-3",
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
        serviceSchedules: parsed.serviceSchedules || parsed.services,
        serviceCompletions: parsed.serviceCompletions
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
      return defaultState();
    }
  }

  return defaultState();
}

function normalizeState(next) {
  if (next.theme !== "dark" && next.theme !== "light") next.theme = "light";
  if (next.language !== "fr" && next.language !== "en") next.language = "en";
  if (next.route === "dashboard") next.route = "services";
  if (next.previousRoute === "dashboard") next.previousRoute = "services";
  if (!next.activeFleetId) next.activeFleetId = "fleet-1";
  if (!Array.isArray(next.fleets)) next.fleets = defaultState().fleets;
  if (!Array.isArray(next.mechanicAccessCodes)) next.mechanicAccessCodes = defaultState().mechanicAccessCodes;
  if (Array.isArray(next.services) && !Array.isArray(next.serviceSchedules)) {
    next.serviceSchedules = next.services.map(normalizeSchedule);
  }
  if (!Array.isArray(next.serviceSchedules)) next.serviceSchedules = [];
  next.serviceSchedules = next.serviceSchedules.map(normalizeSchedule);
  if (!Array.isArray(next.serviceCompletions)) {
    next.serviceCompletions = next.serviceSchedules
      .filter((schedule) => schedule.lastPerformedDate)
      .map(completionFromScheduleSnapshot);
  }
  next.serviceCompletions = next.serviceCompletions.map(normalizeCompletion);
  next.vehicles = (Array.isArray(next.vehicles) ? next.vehicles : []).map((vehicle) => ({
    ...vehicle,
    fleetId: vehicle.fleetId || next.activeFleetId
  }));
  delete next.services;
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

  next.serviceSchedules = services.map((service) => normalizeSchedule({
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
  next.serviceCompletions = next.serviceSchedules
    .filter((schedule) => schedule.lastPerformedDate)
    .map(completionFromScheduleSnapshot);

  return next;
}

function normalizeSchedule(schedule) {
  const recurrenceLabel = schedule.recurrenceLabel || "Every 30 days";
  const intervalDays = Number(schedule.intervalDays || (recurrenceLabel === "Every 60 days" ? 60 : recurrenceLabel === "Every 12 months" ? 365 : 30));
  const intervalKm = schedule.intervalKm === null || schedule.intervalKm === undefined
    ? (schedule.scheduleType === "km" || schedule.scheduleType === "hybrid" ? 10000 : null)
    : Number(schedule.intervalKm);

  return {
    ...schedule,
    id: schedule.id || uid("service"),
    fleetId: schedule.fleetId || "fleet-1",
    scheduleType: schedule.scheduleType || schedule.recurrenceType || (intervalKm ? "hybrid" : "time"),
    recurrenceType: schedule.recurrenceType || schedule.scheduleType || (intervalKm ? "hybrid" : "time"),
    recurrenceLabel,
    intervalDays,
    intervalKm,
    dueDate: schedule.dueDate || todayIso,
    dueKm: schedule.dueKm === undefined ? (intervalKm ? Number(schedule.lastPerformedKm || 0) + intervalKm : null) : schedule.dueKm,
    warningDays: Number(schedule.warningDays ?? 7),
    warningKm: schedule.warningKm === null || schedule.warningKm === undefined ? (intervalKm ? 1000 : null) : Number(schedule.warningKm),
    status: schedule.status === "completed" ? "scheduled" : (schedule.status || "scheduled"),
    lastPerformedDate: schedule.lastPerformedDate || "",
    lastPerformedKm: Number(schedule.lastPerformedKm || 0),
    completedAt: null,
    completionNotes: schedule.completionNotes || ""
  };
}

function normalizeCompletion(completion) {
  return {
    ...completion,
    id: completion.id || uid("completion"),
    fleetId: completion.fleetId || "fleet-1",
    completedDate: completion.completedDate || (completion.completedAt ? isoDate(new Date(completion.completedAt)) : todayIso),
    completedKm: Number(completion.completedKm || 0),
    completedBy: completion.completedBy || "Anthony.Corbin",
    mechanicNote: completion.mechanicNote || completion.completionNotes || "",
    partsNumbers: completion.partsNumbers || "",
    attachmentNames: Array.isArray(completion.attachmentNames) ? completion.attachmentNames : []
  };
}

function completionFromScheduleSnapshot(schedule) {
  return normalizeCompletion({
    id: `completion-${schedule.id}`,
    fleetId: schedule.fleetId || "fleet-1",
    scheduleId: schedule.id,
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

function serviceById(id) {
  return state.serviceSchedules.find((service) => service.id === id);
}

function serviceStatus(service) {
  const vehicle = vehicleById(service.vehicleId);
  const kmRemaining = service.dueKm ? Number(service.dueKm) - Number(vehicle?.kilometers || 0) : null;
  if (service.dueDate && service.dueDate < todayIso) return "overdue";
  if (kmRemaining !== null && kmRemaining <= 0) return "overdue";
  if (service.dueDate && daysUntil(service.dueDate) <= Number(service.warningDays ?? 7)) return "upcoming";
  if (kmRemaining !== null && kmRemaining <= Number(service.warningKm ?? 1000)) return "upcoming";
  return "ok";
}

function servicesForVehicle(vehicleId) {
  return state.serviceSchedules.filter((service) => service.vehicleId === vehicleId);
}

function completionsForVehicle(vehicleId) {
  return state.serviceCompletions
    .filter((completion) => completion.vehicleId === vehicleId)
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
}

function completionsForSchedule(scheduleId) {
  return state.serviceCompletions
    .filter((completion) => completion.scheduleId === scheduleId)
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
}

function visibleServices() {
  const query = state.serviceSearch.trim().toLowerCase();
  return state.serviceSchedules.filter((service) => {
    const vehicle = vehicleById(service.vehicleId);
    const status = serviceStatus(service);
    const matchesFilter = state.serviceFilter === "all" || state.serviceFilter === status;
    const haystack = `${service.title} ${displayServiceTitle(service)} ${vehicle?.title || ""} ${vehicle ? displayVehicleTitle(vehicle) : ""} ${vehicle?.brandModel || ""}`.toLowerCase();
    return matchesFilter && (!query || haystack.includes(query));
  });
}

function statusCounts() {
  return state.serviceSchedules.reduce(
    (counts, service) => {
      counts[serviceStatus(service)] += 1;
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
  if (!service.dueKm) return null;
  const vehicle = vehicleById(service.vehicleId);
  return Number(service.dueKm) - Number(vehicle?.kilometers || 0);
}

function relativeKm(service) {
  const km = kmUntil(service);
  if (km === null) return t("notRecorded");
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
  const hasVehicles = state.vehicles.length > 0;
  const firstUpcoming = state.serviceSchedules.find((service) => serviceStatus(service) === "upcoming");

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
            ? `<div class="list-stack">${firstUpcoming ? serviceCard(firstUpcoming) : vehicleCard(state.vehicles[0])}</div>`
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
    ["all", t("all"), "", state.serviceSchedules.length],
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
  const status = serviceStatus(service);
  const dueDays = daysUntil(service.dueDate);
  const dueChipLabel = status === "ok" ? t("ok") : status === "overdue" ? relativeDue(service.dueDate) : dueDays === 0 ? t("dueToday") : t("dueIn", { time: relativeDue(service.dueDate) });
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
            <strong class="date-value">${icons.calendar}${formatDate(service.dueDate)}</strong>
          </div>
          <div class="date-block">
            <span>${escapeHtml(t("lastPerformed"))}</span>
            <strong class="date-value">${icons.calendar}${formatDate(service.lastPerformedDate)}</strong>
          </div>
        </div>
        <div class="service-actions"><button class="success-btn wide" type="button" data-complete-service="${service.id}">${escapeHtml(t("markCompleted"))} ${icons.check}</button></div>
      </div>
    </article>
  `;
}

function completionCard(completion) {
  const vehicle = vehicleById(completion.vehicleId);
  return `
    <article class="service-card completion-card">
      <div class="service-card-body">
        <div class="service-head compact-head">
          <span>${icons.history}</span>
          <div>
            <h2 class="service-card-title">${escapeHtml(displayServiceTitle(completion))}</h2>
            <div class="vehicle-link static-link">
              ${icons.truck}
              ${escapeHtml(vehicle ? displayVehicleTitle(vehicle) : t("unknownVehicle"))}
            </div>
          </div>
          <span class="due-chip ok">${escapeHtml(t("done"))}</span>
        </div>
        <div class="service-dates">
          <div class="date-block">
            <span>${escapeHtml(t("lastPerformed"))}</span>
            <strong class="date-value">${icons.calendar}${formatDate(completion.completedDate)}</strong>
          </div>
          <div class="date-block">
            <span>${escapeHtml(t("atMileage"))}</span>
            <strong class="date-value">${icons.gauge}${formatKm(completion.completedKm)}</strong>
          </div>
        </div>
        ${completion.mechanicNote ? `<p class="completion-note">${escapeHtml(completion.mechanicNote)}</p>` : ""}
      </div>
    </article>
  `;
}

function renderVehicles() {
  const vehicles = [...state.vehicles].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
  const scheduledServices = servicesForVehicle(vehicle.id);
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
      <h1 class="form-title">${escapeHtml(t("addVehicle"))}</h1>
      <form class="mobile-form" data-add-vehicle-form>
        <label>${escapeHtml(t("title"))} <input name="title" autocomplete="off" required /></label>
        <label>${escapeHtml(t("unitNumber"))} <input name="unitNumber" autocomplete="off" required /></label>
        <label>${escapeHtml(t("brandModel"))} <input name="brandModel" autocomplete="off" required /></label>
      </form>
      <div class="action-bar">
        <button class="success-btn wide" type="submit" form="unused" data-submit-add-vehicle>${escapeHtml(t("addVehicle"))} ${icons.check}</button>
        <button class="outline-btn wide" type="button" data-route="vehicles">${escapeHtml(t("back"))}</button>
      </div>
    </div>
  `;
}

function renderServiceDetails() {
  const service = serviceById(state.activeServiceId) || state.serviceSchedules[0];
  if (!service) return renderServices();
  const vehicle = vehicleById(service.vehicleId);
  const status = serviceStatus(service);
  const latestCompletion = completionsForSchedule(service.id)[0];
  const scheduleLabel = service.scheduleType === "hybrid" ? t("timeAndKmBased") : service.scheduleType === "km" ? t("kmBased") : t("timeBased");

  return `
    <div class="screen with-actions">
      ${header()}
      <div class="back-row">
        <button class="icon-btn" type="button" data-route="services" aria-label="${escapeAttr(t("back"))}">${icons.back}</button>
        <div class="back-title">${escapeHtml(displayServiceTitle(service))}<span>${icons.truck} ${escapeHtml(vehicle ? displayVehicleTitle(vehicle) : t("unknownVehicle"))}</span></div>
      </div>
      <div class="detail-chip-grid">
        <div class="detail-chip">${icons.calendar} ${escapeHtml(scheduleLabel)}<strong>${escapeHtml(displayRecurrenceLabel(service.recurrenceLabel))}</strong></div>
        <div class="detail-chip">${icons.calendar} ${escapeHtml(t("nextDue"))}<strong>${shortDate(service.dueDate)}</strong></div>
        <div class="detail-chip">${icons.gauge} ${escapeHtml(t("nextDueKm"))}<strong>${service.dueKm ? formatKm(service.dueKm) : t("notRecorded")}</strong></div>
        <div class="detail-chip">${icons.gauge} ${escapeHtml(t("currentKm"))}<strong>${vehicle ? formatKm(vehicle.kilometers) : t("notRecorded")}</strong></div>
      </div>
      <div class="status-panel">${icons.calendar}<div>${escapeHtml(status === "ok" ? t("ok") : status === "overdue" ? t("overdue") : t("upcoming"))}<strong>${escapeHtml(service.dueKm ? `${relativeDue(service.dueDate)} / ${relativeKm(service)}` : relativeDue(service.dueDate))}</strong></div></div>
      <article class="detail-card">
        <h3>${icons.history} ${escapeHtml(t("lastCompletion"))}</h3>
        <div class="history-grid">
          <div>
            <span class="detail-label">${escapeHtml(t("lastPerformed"))}</span>
            <strong class="date-value">${icons.calendar}${latestCompletion ? shortDate(latestCompletion.completedDate) : t("noCompletionYet")}</strong>
          </div>
          <div>
            <span class="detail-label">${escapeHtml(t("atMileage"))}</span>
            <strong class="date-value">${icons.gauge}${latestCompletion ? formatKm(latestCompletion.completedKm) : t("notRecorded")}</strong>
          </div>
        </div>
        ${latestCompletion?.mechanicNote ? `<p class="completion-note">${escapeHtml(latestCompletion.mechanicNote)}</p>` : ""}
      </article>
      <article class="detail-card completion-form-card">
        <h3>${icons.wrench} ${escapeHtml(t("completionDetails"))}</h3>
        <form class="completion-form" data-completion-form="${service.id}">
          <label>${escapeHtml(t("currentKm"))}<input name="completedKm" type="number" inputmode="numeric" min="0" value="${escapeAttr(vehicle?.kilometers || service.lastPerformedKm || 0)}" /></label>
          <label>${escapeHtml(t("mechanicNote"))}<textarea name="mechanicNote" rows="3" placeholder="${escapeAttr(t("mechanicNotePlaceholder"))}"></textarea></label>
          <label>${escapeHtml(t("partsNumbers"))}<input name="partsNumbers" autocomplete="off" placeholder="${escapeAttr(t("partsNumbersPlaceholder"))}" /></label>
          <label>${escapeHtml(t("photosDocuments"))}<input name="attachments" type="file" multiple /><small>${escapeHtml(t("photosDocumentsHint"))}</small></label>
        </form>
      </article>
      <div class="action-bar">
        <button class="success-btn wide" type="button" data-submit-completion="${service.id}">${escapeHtml(t("markCompleted"))} ${icons.check}</button>
        <button class="outline-btn wide" type="button" data-route="services">${escapeHtml(t("back"))}</button>
      </div>
    </div>
  `;
}

function renderTruckDetails() {
  const vehicle = vehicleById(state.activeVehicleId) || state.vehicles[0];
  if (!vehicle) return renderVehicles();
  const counts = servicesForVehicle(vehicle.id).reduce(
    (acc, service) => {
      acc[serviceStatus(service)] += 1;
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
    const scheduled = servicesForVehicle(vehicle.id);
    return `<div class="list-stack">${scheduled.length ? scheduled.map(serviceCard).join("") : `<div class="ghost-note">${escapeHtml(t("noScheduledServices"))}</div>`}</div>`;
  }

  if (state.truckTab === "history") {
    const history = completionsForVehicle(vehicle.id);
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
  if (state.profileTab === "fleet") return `<div class="ghost-note">${escapeHtml(t("fleetPreferences"))}</div>`;
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

function completeService(serviceId, details = {}) {
  const service = serviceById(serviceId);
  if (!service) return;
  const vehicle = vehicleById(service.vehicleId);
  const completedKm = Number(details.completedKm || vehicle?.kilometers || service.lastPerformedKm || 0);
  const mechanicNote = details.mechanicNote || t("completionNotes");
  const attachmentNames = Array.isArray(details.attachmentNames) ? details.attachmentNames : [];
  const completedAt = new Date().toISOString();

  state.serviceCompletions.unshift(normalizeCompletion({
    id: uid("completion"),
    fleetId: service.fleetId || state.activeFleetId,
    scheduleId: service.id,
    vehicleId: service.vehicleId,
    title: service.title,
    completedAt,
    completedDate: todayIso,
    completedKm,
    completedBy: state.user.displayName,
    mechanicNote,
    partsNumbers: details.partsNumbers || "",
    attachmentNames
  }));

  service.status = "scheduled";
  service.completedAt = null;
  service.lastPerformedDate = todayIso;
  service.lastPerformedKm = completedKm;
  service.completionNotes = mechanicNote;
  if (service.intervalDays) service.dueDate = addDaysToIso(todayIso, service.intervalDays);
  if (service.intervalKm) service.dueKm = completedKm + Number(service.intervalKm);
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
    title: data.title,
    unitNumber: data.unitNumber,
    brandModel: data.brandModel,
    year: "",
    kilometers: 0,
    technical: {
      engineBrandModel: "TX-500",
      engineSerialNumber: "",
      filterPartNumbers: ""
    },
    createdAt: new Date(Date.now() + nextNumber).toISOString()
  });
  navigate("vehicles");
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
    </div>
  `;
}

function routeMarkup() {
  if (state.route === "services") return renderServices();
  if (state.route === "vehicles") return renderVehicles();
  if (state.route === "profile") return renderProfile();
  if (state.route === "addVehicle") return renderAddVehicle();
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
  const completeId = event.target.closest("[data-complete-service]")?.dataset.completeService;
  const submitCompletionId = event.target.closest("[data-submit-completion]")?.dataset.submitCompletion;
  const filter = event.target.closest("[data-filter]")?.dataset.filter;
  const profileTab = event.target.closest("[data-profile-tab]")?.dataset.profileTab;
  const truckTab = event.target.closest("[data-truck-tab]")?.dataset.truckTab;
  const deleteVehicleId = event.target.closest("[data-delete-vehicle]")?.dataset.deleteVehicle;
  const toggleTheme = event.target.closest("[data-toggle-theme]");
  const language = event.target.closest("[data-language]")?.dataset.language;

  if (submitCompletionId) {
    completeService(submitCompletionId, completionFormValues(submitCompletionId));
    render();
    return;
  }
  if (completeId) {
    completeService(completeId);
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
    navigate(route);
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
    state.serviceSchedules = state.serviceSchedules.filter((service) => service.vehicleId !== deleteVehicleId);
    state.serviceCompletions = state.serviceCompletions.filter((completion) => completion.vehicleId !== deleteVehicleId);
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
});

app.addEventListener("submit", (event) => {
  if (event.target.matches("[data-add-vehicle-form]")) {
    event.preventDefault();
    addVehicleFromForm(event.target);
  }
});

render();

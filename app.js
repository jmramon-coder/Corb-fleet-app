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
  arrowRight: `<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>`,
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
  arrowRight: icon("arrowRight", "icon"),
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
  if (!value) return "Not recorded";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date(`${value}T00:00:00`));
}

function shortDate(value) {
  if (!value) return "Not recorded";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(`${value}T00:00:00`));
}

function formatKm(value) {
  return `${Number(value || 0).toLocaleString()} km`;
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
    activeServiceId: null,
    activeVehicleId: null,
    serviceFilter: "all",
    serviceSearch: "",
    profileTab: "account",
    truckTab: "details",
    theme: "light",
    user: {
      firstName: "Anthony",
      displayName: "Anthony.Corbin",
      email: "Anthony_1997@gmail.com",
      role: "Mechanic",
      joinedAt: "2025-10-10"
    },
    vehicles: [
      {
        id: "vehicle-1",
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
    services: [
      {
        id: "service-1",
        vehicleId: "vehicle-1",
        title: "Changement d’huile",
        recurrenceType: "time",
        recurrenceLabel: "Every 30 days",
        dueDate: addDays(1),
        lastPerformedDate: "2025-10-29",
        lastPerformedKm: 99920,
        status: "scheduled",
        completedAt: null,
        completionNotes: ""
      },
      {
        id: "service-2",
        vehicleId: "vehicle-1",
        title: "Brake inspection",
        recurrenceType: "time",
        recurrenceLabel: "Every 60 days",
        dueDate: addDays(18),
        lastPerformedDate: "2025-10-10",
        lastPerformedKm: 98200,
        status: "scheduled",
        completedAt: null,
        completionNotes: ""
      },
      {
        id: "service-3",
        vehicleId: "vehicle-2",
        title: "Changement d’huile",
        recurrenceType: "time",
        recurrenceLabel: "Every 30 days",
        dueDate: addDays(-2),
        lastPerformedDate: "2025-10-29",
        lastPerformedKm: 1251100,
        status: "scheduled",
        completedAt: null,
        completionNotes: ""
      },
      {
        id: "service-4",
        vehicleId: "vehicle-2",
        title: "Annual inspection",
        recurrenceType: "time",
        recurrenceLabel: "Every 12 months",
        dueDate: addDays(30),
        lastPerformedDate: "2025-05-11",
        lastPerformedKm: 1211000,
        status: "scheduled",
        completedAt: null,
        completionNotes: ""
      }
    ]
  };
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return normalizeState({ ...defaultState(), ...JSON.parse(saved) });
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
  if (next.route === "dashboard") next.route = "services";
  if (next.previousRoute === "dashboard") next.previousRoute = "services";
  return next;
}

function migrateOldState(old) {
  const next = defaultState();
  const vehicles = Array.isArray(old.vehicles) ? old.vehicles : [];
  const services = Array.isArray(old.services) ? old.services : [];

  next.vehicles = vehicles.map((vehicle, index) => ({
    id: vehicle.id || uid("vehicle"),
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

  next.services = services.map((service) => ({
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

  return next;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function vehicleById(id) {
  return state.vehicles.find((vehicle) => vehicle.id === id);
}

function serviceById(id) {
  return state.services.find((service) => service.id === id);
}

function serviceStatus(service) {
  if (service.status === "completed") return "ok";
  return service.dueDate < todayIso ? "overdue" : "upcoming";
}

function servicesForVehicle(vehicleId) {
  return state.services.filter((service) => service.vehicleId === vehicleId);
}

function visibleServices() {
  const query = state.serviceSearch.trim().toLowerCase();
  return state.services.filter((service) => {
    const vehicle = vehicleById(service.vehicleId);
    const status = serviceStatus(service);
    const matchesFilter = state.serviceFilter === "all" || state.serviceFilter === status;
    const haystack = `${service.title} ${vehicle?.title || ""} ${vehicle?.brandModel || ""}`.toLowerCase();
    return matchesFilter && (!query || haystack.includes(query));
  });
}

function statusCounts() {
  return state.services.reduce(
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
  if (days < 0) return `${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} late`;
  if (days === 0) return "Today";
  return `${days} day${days === 1 ? "" : "s"}`;
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
  if (params.get("theme") === "dark" || params.get("theme") === "light") state.theme = params.get("theme");
}

function header({ close = false } = {}) {
  const action = close
    ? `<button class="icon-btn" type="button" data-route="${state.previousRoute || "services"}" aria-label="Close">${icons.x}</button>`
    : `<button class="icon-btn" type="button" data-route="profile" aria-label="Profile">${icons.profile}</button>`;

  return `
    <header class="brand-header">
      <div class="brand">
        <span class="brand-mark" aria-hidden="true"></span>
        <span class="brand-name"><strong>CORB</strong><span>Fleet Manager</span></span>
      </div>
      ${action}
    </header>
  `;
}

function bottomNav(active) {
  return `
    <div class="nav-scrim" aria-hidden="true"></div>
    <nav class="bottom-nav" aria-label="Main navigation">
      ${navButton("services", "Services", icons.services, active)}
      ${navButton("vehicles", "Vehicles", icons.truck, active)}
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
  const overdueLabel = options.compact ? "Overdue" : "Overdue<br />Tasks";
  const upcomingLabel = options.compact ? "Upcoming" : "Upcoming<br />Tasks";

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
        <h2 class="empty-title">No vehicle yet</h2>
        <p class="empty-copy">Add your first vehicle to start tracking maintenance schedules and service history</p>
        <button class="primary-btn" type="button" data-route="addVehicle">
          Add vehicle
          <span class="button-icon-box">${icons.plus}</span>
        </button>
      </div>
    </article>
  `;
}

function renderDashboard() {
  const hasVehicles = state.vehicles.length > 0;
  const firstUpcoming = state.services.find((service) => serviceStatus(service) === "upcoming");

  return `
    <div class="screen">
      ${header()}
      <section class="dashboard-content">
        <div class="screen-heading">
          <h1 class="screen-title">Welcome<br />${state.user.firstName},</h1>
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
          <h1 class="screen-title">Welcome<br />${escapeHtml(state.user.firstName)},</h1>
          <p class="screen-subtitle">Services</p>
        </div>
        <div>
          <div class="search-wrap">
            <label class="search-box">
              ${icons.search}
              <input value="${escapeAttr(state.serviceSearch)}" placeholder="" aria-label="Search services" data-service-search />
            </label>
          </div>
          ${filterRow()}
          <div class="list-stack">
            ${services.length ? services.map(serviceCard).join("") : `<div class="ghost-note">No services match this view.</div>`}
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
    ["all", "All", "", state.services.length],
    ["overdue", "Overdue", "overdue", counts.overdue],
    ["upcoming", "Upcoming", "upcoming", counts.upcoming],
    ["ok", "Ok", "ok", counts.ok]
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
  const disabled = serviceStatus(service) === "ok";
  const status = serviceStatus(service);
  const dueDays = daysUntil(service.dueDate);
  const dueChipLabel = status === "ok" ? "Done" : status === "overdue" ? relativeDue(service.dueDate) : dueDays === 0 ? "Due today" : `Due in ${relativeDue(service.dueDate)}`;
  return `
    <article class="service-card">
      <div class="service-head">
        <span>${icons.wrench}</span>
        <div>
          <h2 class="service-card-title">${escapeHtml(service.title)}</h2>
          <button class="vehicle-link" type="button" data-open-vehicle="${service.vehicleId}">
            ${icons.truck}
            ${escapeHtml(vehicle?.title || "Unknown vehicle")}
          </button>
        </div>
      </div>
      <div class="service-dates">
        <div class="date-block">
          <div class="date-label-row">
            <span>Next due</span>
            <span class="due-chip ${status}">${escapeHtml(dueChipLabel)}</span>
          </div>
          <strong class="date-value">${icons.calendar}${formatDate(service.dueDate)}</strong>
        </div>
        <div class="date-block">
          <span>Last performed</span>
          <strong class="date-value">${icons.calendar}${formatDate(service.lastPerformedDate)}</strong>
        </div>
      </div>
      <div class="service-actions">
        <button class="primary-btn wide" type="button" data-open-service="${service.id}">
          View details <span class="button-icon-box">${icons.arrowRight}</span>
        </button>
        ${disabled ? "" : `<button class="success-btn wide" type="button" data-complete-service="${service.id}">Mark as completed ${icons.check}</button>`}
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
          <h1 class="screen-title">Vehicle Fleet</h1>
          <p class="screen-subtitle">Manage all vehicles in your fleet</p>
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
  const openServices = servicesForVehicle(vehicle.id).filter((service) => serviceStatus(service) !== "ok");
  return `
    <article class="vehicle-card click-card" data-open-vehicle="${vehicle.id}">
      <div class="vehicle-top">
        <div>
          <h2 class="vehicle-card-title">${escapeHtml(vehicle.title)}</h2>
          <div class="vehicle-model">${escapeHtml(modelLine(vehicle))}</div>
        </div>
        <span class="calendar-badge soft">${icons.calendar}<span>${openServices.length}</span></span>
      </div>
      <div class="vehicle-stats">
        <span class="vehicle-stat">${icons.gauge}${formatKm(vehicle.kilometers)}</span>
        <span class="vehicle-stat">${icons.wrench}${openServices.length} maintenance schedules</span>
      </div>
      <div class="vehicle-card-action" aria-hidden="true">
        <span>View truck details</span>${icons.arrowRight}
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
        <button class="icon-btn" type="button" data-route="vehicles" aria-label="Back to vehicles">${icons.back}</button>
        <div class="back-title">Back to vehicles</div>
      </div>
      <h1 class="form-title">Add Vehicle</h1>
      <form class="mobile-form" data-add-vehicle-form>
        <label>Title <input name="title" autocomplete="off" required /></label>
        <label>Unity Number <input name="unitNumber" autocomplete="off" required /></label>
        <label>Brand/Model <input name="brandModel" autocomplete="off" required /></label>
      </form>
      <div class="action-bar">
        <button class="success-btn wide" type="submit" form="unused" data-submit-add-vehicle>Mark as completed ${icons.check}</button>
        <button class="outline-btn wide" type="button" data-route="vehicles">Back</button>
      </div>
    </div>
  `;
}

function renderServiceDetails() {
  const service = serviceById(state.activeServiceId) || state.services[0];
  if (!service) return renderServices();
  const vehicle = vehicleById(service.vehicleId);

  return `
    <div class="screen with-actions">
      ${header()}
      <div class="back-row">
        <button class="icon-btn" type="button" data-route="services" aria-label="Back">${icons.back}</button>
        <div class="back-title">${escapeHtml(service.title)}<span>${icons.truck} ${escapeHtml(vehicle?.title || "Unknown vehicle")}</span></div>
      </div>
      <div class="detail-chip-grid">
        <div class="detail-chip">${icons.calendar} Time based<strong>${escapeHtml(service.recurrenceLabel)}</strong></div>
        <div class="detail-chip">${icons.calendar} Next due<strong>${shortDate(service.dueDate)}</strong></div>
      </div>
      <div class="status-panel">${icons.calendar}<div>${serviceStatus(service) === "ok" ? "Ok" : serviceStatus(service) === "overdue" ? "Overdue" : "Upcoming"}<strong>${relativeDue(service.dueDate)}</strong></div></div>
      <article class="detail-card">
        <h3>${icons.history} Maintenance history</h3>
        <div class="history-grid">
          <div>
            <span class="detail-label">Last performed</span>
            <strong class="date-value">${icons.calendar}${shortDate(service.lastPerformedDate)}</strong>
          </div>
          <div>
            <span class="detail-label">At mileage</span>
            <strong class="date-value">${icons.gauge}${formatKm(service.lastPerformedKm)}</strong>
          </div>
        </div>
      </article>
      <div class="action-bar">
        <button class="success-btn wide" type="button" data-complete-service="${service.id}">Mark as completed ${icons.check}</button>
        <button class="outline-btn wide" type="button" data-route="services">Back</button>
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
        <button class="detail-back-btn" type="button" data-route="vehicles" aria-label="Back to vehicles">
          ${icons.back}
          <span>Vehicles</span>
        </button>
        <div class="truck-title-row">
          <div class="truck-heading">
            <h1>${escapeHtml(vehicle.title)}</h1>
            <p>${escapeHtml(modelLine(vehicle))}</p>
          </div>
          <div class="truck-header-actions">
            <button class="plain-icon-btn" type="button" aria-label="Edit truck">${icons.edit}</button>
            <button class="plain-icon-btn danger-icon" type="button" data-delete-vehicle="${vehicle.id}" aria-label="Delete truck">${icons.trash}</button>
          </div>
        </div>
        ${truckTabs()}
      </section>
      <div class="truck-metrics-shell">${metricCards(counts, { compact: true })}</div>
      ${truckTabContent(vehicle)}
      <div class="action-bar single-action">
        <button class="primary-btn wide" type="button" data-route="services">Service ${icons.wrench}</button>
      </div>
    </div>
  `;
}

function truckTabs() {
  return appTabs({
    items: [
      { key: "details", label: "Details" },
      { key: "schedule", label: "Schedule" },
      { key: "history", label: "History" }
    ],
    active: state.truckTab,
    dataAttribute: "data-truck-tab",
    className: "truck-tabs full-bleed-tabs"
  });
}

function truckTabContent(vehicle) {
  if (state.truckTab === "schedule") {
    const scheduled = servicesForVehicle(vehicle.id).filter((service) => serviceStatus(service) !== "ok");
    return `<div class="list-stack">${scheduled.length ? scheduled.map(serviceCard).join("") : `<div class="ghost-note">No scheduled services.</div>`}</div>`;
  }

  if (state.truckTab === "history") {
    const history = servicesForVehicle(vehicle.id).filter((service) => serviceStatus(service) === "ok");
    return `<div class="list-stack">${history.length ? history.map(serviceCard).join("") : `<div class="ghost-note">No completed service history.</div>`}</div>`;
  }

  return `
    <article class="technical-card">
      <div class="technical-head">
        <h3>${icons.folder} Technical details</h3>
      </div>
      <div class="technical-list">
        <div><span class="detail-label">Unit Number</span><strong>${escapeHtml(vehicle.unitNumber)}</strong></div>
        <div><span class="detail-label">Engine Brand/Model</span><strong>${escapeHtml(vehicle.technical.engineBrandModel)}</strong></div>
        <div><span class="detail-label">Engine Serial Number</span><strong>${escapeHtml(vehicle.technical.engineSerialNumber)}</strong></div>
        <div><span class="detail-label">Filter Part Numbers</span><strong>${escapeHtml(vehicle.technical.filterPartNumbers)}</strong></div>
      </div>
    </article>
  `;
}

function renderProfile() {
  return `
    <div class="screen">
      ${header({ close: true })}
      <h1 class="profile-title">Profil</h1>
      ${appTabs({
        items: [
          { key: "account", label: "Account" },
          { key: "fleet", label: "Fleet" },
          { key: "settings", label: "Settings" }
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
  if (state.profileTab === "fleet") return `<div class="ghost-note">Fleet preferences will live here.</div>`;
  if (state.profileTab === "settings") return renderSettingsPanel();

  return `
    <article class="profile-card">
      <div class="account-row">
        <span class="avatar" aria-hidden="true"></span>
        <div class="account-main">
          <div class="account-name">${escapeHtml(state.user.displayName)}</div>
          <div class="account-email">${icons.mail}${escapeHtml(state.user.email)}</div>
        </div>
        <button class="plain-icon-btn account-edit" type="button" aria-label="Edit profile">${icons.edit}</button>
      </div>
      <div class="profile-grid">
        <div><span class="detail-label">Joined</span><strong>${formatDate(state.user.joinedAt)}</strong></div>
        <div><span class="detail-label">Role</span><strong>${escapeHtml(state.user.role)}</strong></div>
      </div>
    </article>
    <article class="profile-card security-card">
      <h2 class="security-title">${icons.lock} Security</h2>
      <button class="outline-btn wide" type="button">Change password</button>
      <button class="danger-btn wide" type="button">Logout ${icons.logout}</button>
    </article>
  `;
}

function renderSettingsPanel() {
  const darkMode = state.theme === "dark";
  return `
    <article class="profile-card settings-card">
      <div>
        <h2 class="security-title">${icons.gauge} Appearance</h2>
        <p class="settings-copy">Choose the visual mode that feels best for your workspace.</p>
      </div>
      <button class="setting-row" type="button" data-toggle-theme aria-pressed="${darkMode}">
        <span>
          <strong>Dark mode</strong>
          <small>${darkMode ? "On" : "Off"}</small>
        </span>
        <span class="switch ${darkMode ? "on" : ""}" aria-hidden="true"><span></span></span>
      </button>
    </article>
  `;
}

function completeService(serviceId) {
  const service = serviceById(serviceId);
  if (!service) return;
  const vehicle = vehicleById(service.vehicleId);
  service.status = "completed";
  service.completedAt = new Date().toISOString();
  service.lastPerformedDate = todayIso;
  service.lastPerformedKm = vehicle?.kilometers || service.lastPerformedKm || 0;
  service.completionNotes = "Marked complete from mobile workflow.";
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
  const filter = event.target.closest("[data-filter]")?.dataset.filter;
  const profileTab = event.target.closest("[data-profile-tab]")?.dataset.profileTab;
  const truckTab = event.target.closest("[data-truck-tab]")?.dataset.truckTab;
  const deleteVehicleId = event.target.closest("[data-delete-vehicle]")?.dataset.deleteVehicle;
  const toggleTheme = event.target.closest("[data-toggle-theme]");

  if (route) navigate(route);
  if (serviceId) navigate("serviceDetails", { activeServiceId: serviceId });
  if (vehicleId) navigate("truckDetails", { activeVehicleId: vehicleId, truckTab: "details" });
  if (completeId) {
    completeService(completeId);
    render();
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
  if (deleteVehicleId && confirm("Delete this vehicle and its services?")) {
    state.vehicles = state.vehicles.filter((vehicle) => vehicle.id !== deleteVehicleId);
    state.services = state.services.filter((service) => service.vehicleId !== deleteVehicleId);
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

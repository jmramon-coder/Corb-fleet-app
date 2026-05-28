const fs = require("fs");
const http = require("http");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");

const rootDir = path.resolve(__dirname, "..");
const chromeCandidates = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser"
].filter(Boolean);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function findChrome() {
  return chromeCandidates.find((candidate) => fs.existsSync(candidate));
}

function startStaticServer() {
  const server = http.createServer((request, response) => {
    const requestUrl = new URL(request.url, "http://127.0.0.1");
    const relativePath = requestUrl.pathname === "/" ? "index.html" : requestUrl.pathname.slice(1);
    const safePath = path.normalize(relativePath).replace(/^(\.\.[/\\])+/, "");
    const filePath = path.join(rootDir, safePath);

    if (!filePath.startsWith(rootDir) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    fs.createReadStream(filePath).pipe(response);
  });

  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({ server, baseUrl: `http://127.0.0.1:${port}` });
    });
  });
}

function requestJson(port, route, method = "GET") {
  return new Promise((resolve, reject) => {
    const request = http.request({ host: "127.0.0.1", port, path: route, method }, (response) => {
      let body = "";
      response.on("data", (chunk) => {
        body += chunk;
      });
      response.on("end", () => {
        try {
          resolve(JSON.parse(body));
        } catch {
          reject(new Error(body));
        }
      });
    });
    request.on("error", reject);
    request.end();
  });
}

async function waitForDevTools(port, retries = 50) {
  for (let index = 0; index < retries; index += 1) {
    try {
      await requestJson(port, "/json/version");
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  throw new Error("Chrome DevTools did not start");
}

function createCdpClient(webSocketUrl) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(webSocketUrl);
    const pending = new Map();
    let id = 1;

    socket.onopen = () => {
      const send = (method, params = {}) => new Promise((commandResolve, commandReject) => {
        const commandId = id;
        id += 1;
        pending.set(commandId, { resolve: commandResolve, reject: commandReject });
        socket.send(JSON.stringify({ id: commandId, method, params }));
      });

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (!message.id || !pending.has(message.id)) return;
        const command = pending.get(message.id);
        pending.delete(message.id);
        if (message.error) command.reject(new Error(JSON.stringify(message.error)));
        else command.resolve(message.result);
      };

      resolve({
        send,
        close: () => socket.close()
      });
    };

    socket.onerror = reject;
  });
}

async function evaluate(client, expression) {
  const result = await client.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description || JSON.stringify(result.exceptionDetails));
  }
  return result.result.value;
}

async function openPage(client, url) {
  await client.send("Page.navigate", { url });
  await new Promise((resolve) => setTimeout(resolve, 500));
}

async function waitForCondition(client, expression, message, retries = 20) {
  for (let index = 0; index < retries; index += 1) {
    if (await evaluate(client, expression)) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(message);
}

async function run() {
  const chromePath = findChrome();
  assert(chromePath, "Chrome or Chromium was not found. Set CHROME_PATH to run E2E tests.");

  const { server, baseUrl } = await startStaticServer();
  const debugPort = 9333 + Math.floor(Math.random() * 300);
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "corb-e2e-"));
  const chrome = spawn(chromePath, [
    "--headless=new",
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${userDataDir}`,
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "about:blank"
  ], { stdio: "ignore" });

  let client;
  try {
    await waitForDevTools(debugPort);
    const tab = await requestJson(debugPort, `/json/new?${encodeURIComponent(baseUrl)}`, "PUT");
    client = await createCdpClient(tab.webSocketDebuggerUrl);
    await client.send("Runtime.enable");
    await client.send("Page.enable");
    await client.send("Emulation.setDeviceMetricsOverride", {
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      mobile: true
    });

    await openPage(client, baseUrl);
    await evaluate(client, `localStorage.removeItem('corb-fleet-manager-state-v2');`);
    await openPage(client, `${baseUrl}/?route=landing&language=fr&theme=dark&e2e=landing#pricing`);
    await waitForCondition(client, `!document.querySelector('.is-booting')`, "Boot animation class did not clear");
    const landing = await evaluate(client, `(() => ({
      hash: location.hash,
      scrollY: Math.round(window.scrollY),
      hasLoginForm: !!document.querySelector('[data-login-form]'),
      hasPhonePreview: !!document.querySelector('.phone-preview'),
      outcomeCards: document.querySelectorAll('.landing-feature-grid article').length,
      pricingCards: document.querySelectorAll('.landing-pricing-grid article').length,
      footer: !!document.querySelector('.landing-footer'),
      booting: !!document.querySelector('.is-booting'),
      overflowX: document.documentElement.scrollWidth > window.innerWidth
    }))()`);
    assert(landing.hash === "", "Landing should clear stale section hash");
    assert(landing.scrollY === 0, "Landing should refresh at the top");
    assert(!landing.hasLoginForm, "Landing should not embed login form");
    assert(!landing.hasPhonePreview, "Landing should not show old app preview mockup");
    assert(landing.outcomeCards === 4, "Landing should show four outcome cards");
    assert(landing.pricingCards === 3, "Landing pricing should show three plans");
    assert(landing.footer, "Landing footer is missing");
    assert(!landing.booting, "Boot animation class did not clear");
    assert(!landing.overflowX, "Landing has horizontal overflow");

    await evaluate(client, `document.querySelector('.landing-login-button')?.click();`);
    await new Promise((resolve) => setTimeout(resolve, 250));
    const loginRoute = await evaluate(client, `(() => ({
      hasLoginForm: !!document.querySelector('[data-login-form]'),
      hasLandingHero: !!document.querySelector('.landing-hero'),
      route: JSON.parse(localStorage.getItem('corb-fleet-manager-state-v2')).route,
      overflowX: document.documentElement.scrollWidth > window.innerWidth
    }))()`);
    assert(loginRoute.route === "login", "Landing login button did not navigate to login route");
    assert(loginRoute.hasLoginForm, "Dedicated login page form is missing");
    assert(!loginRoute.hasLandingHero, "Login route should not include landing hero");
    assert(!loginRoute.overflowX, "Login page has horizontal overflow");

    await openPage(client, `${baseUrl}/?route=login&language=fr&theme=dark`);
    await evaluate(client, `localStorage.removeItem('corb-fleet-manager-state-v2'); location.href='${baseUrl}/?route=login&language=fr&theme=dark&loginMode=owner';`);
    await new Promise((resolve) => setTimeout(resolve, 400));
    await evaluate(client, `document.querySelector('[data-login-form]').requestSubmit();`);
    await new Promise((resolve) => setTimeout(resolve, 300));

    const ownerHome = await evaluate(client, `(() => ({
      authMode: JSON.parse(localStorage.getItem('corb-fleet-manager-state-v2')).authMode,
      title: document.querySelector('.cockpit-hero h1')?.textContent,
      nav: [...document.querySelectorAll('.bottom-nav .nav-tab span:last-child')].map((item) => item.textContent.trim()),
      hasActions: !!document.querySelector('[data-toggle-create-menu]'),
      overflowX: document.documentElement.scrollWidth > window.innerWidth
    }))()`);
    assert(ownerHome.authMode === "owner", "Owner login did not set owner auth mode");
    assert(ownerHome.title.includes("Anthony"), "Owner home greeting is missing");
    assert(ownerHome.nav.includes("Actions"), "Owner bottom nav should include Actions");
    assert(ownerHome.hasActions, "Owner action button is missing");
    assert(!ownerHome.overflowX, "Owner home has horizontal overflow");

    await evaluate(client, `state.route='addVehicle'; render();`);
    await new Promise((resolve) => setTimeout(resolve, 200));
    await evaluate(client, `(() => {
      const form = document.querySelector('[data-add-vehicle-form]');
      form.elements.unitNumber.value = 'U-900';
      form.elements.machineType.value = 'Niveleuse';
      form.elements.brandModelYear.value = 'CAT 140M - 2022';
      form.elements.machineSerialNumber.value = 'CAT140M-22-900';
      form.elements.kilometers.value = '45500';
      form.elements.engineSerialNumber.value = 'ENG-900';
      form.elements.partsAndFilters.value = 'P-77, F-88';
      form.requestSubmit();
    })()`);
    await new Promise((resolve) => setTimeout(resolve, 250));
    const createdVehicle = await evaluate(client, `(() => {
      const state = JSON.parse(localStorage.getItem('corb-fleet-manager-state-v2'));
      const vehicle = state.vehicles[0];
      return {
        unitNumber: vehicle.unitNumber,
        machineType: vehicle.machineType,
        brandModelYear: vehicle.brandModelYear,
        machineSerialNumber: vehicle.machineSerialNumber,
        engineSerialNumber: vehicle.technical.engineSerialNumber,
        partsAndFilters: vehicle.technical.partsAndFilters,
        legacyFilterAlias: vehicle.technical.filterPartNumbers
      };
    })()`);
    assert(createdVehicle.unitNumber === "U-900", "Vehicle unit number was not saved");
    assert(createdVehicle.machineType === "Niveleuse", "Vehicle machine type was not saved");
    assert(createdVehicle.brandModelYear === "CAT 140M - 2022", "Vehicle brand/model/year was not saved");
    assert(createdVehicle.machineSerialNumber === "CAT140M-22-900", "Vehicle machine serial was not saved");
    assert(createdVehicle.engineSerialNumber === "ENG-900", "Vehicle engine serial was not saved");
    assert(createdVehicle.partsAndFilters === "P-77, F-88", "Vehicle parts and filters were not saved");
    assert(createdVehicle.legacyFilterAlias === "P-77, F-88", "Vehicle legacy filter alias should stay synchronized");

    await evaluate(client, `state.route='truckDetails'; state.activeVehicleId=JSON.parse(localStorage.getItem('corb-fleet-manager-state-v2')).vehicles[0].id; state.truckTab='details'; render();`);
    await new Promise((resolve) => setTimeout(resolve, 200));
    const vehicleDetailsText = await evaluate(client, `document.querySelector('.technical-card')?.innerText || ''`);
    assert(vehicleDetailsText.includes("U-900"), "Vehicle details should show unit number");
    assert(vehicleDetailsText.includes("Niveleuse"), "Vehicle details should show machine type");
    assert(vehicleDetailsText.includes("CAT 140M - 2022"), "Vehicle details should show brand/model/year");
    assert(vehicleDetailsText.includes("CAT140M-22-900"), "Vehicle details should show machine serial number");
    assert(vehicleDetailsText.includes("ENG-900"), "Vehicle details should show engine serial number");
    assert(vehicleDetailsText.includes("P-77, F-88"), "Vehicle details should show parts and filters");

    await evaluate(client, `(() => {
      const currentState = JSON.parse(localStorage.getItem('corb-fleet-manager-state-v2'));
      state.route = 'editVehicle';
      state.activeVehicleId = currentState.vehicles[0].id;
      render();
    })()`);
    await new Promise((resolve) => setTimeout(resolve, 200));
    await evaluate(client, `(() => {
      const form = document.querySelector('[data-edit-vehicle-form]');
      form.elements.unitNumber.value = 'U-901';
      form.elements.machineType.value = 'Chargeuse';
      form.elements.brandModelYear.value = 'CAT 950M - 2023';
      form.elements.machineSerialNumber.value = 'CAT950M-23-901';
      form.elements.kilometers.value = '46200';
      form.elements.engineSerialNumber.value = 'ENG-901';
      form.elements.partsAndFilters.value = 'P-99, F-100';
      form.requestSubmit();
    })()`);
    await new Promise((resolve) => setTimeout(resolve, 250));
    const editedVehicle = await evaluate(client, `(() => {
      const savedState = JSON.parse(localStorage.getItem('corb-fleet-manager-state-v2'));
      const vehicle = savedState.vehicles[0];
      return {
        route: savedState.route,
        vehicleCount: savedState.vehicles.length,
        unitNumber: vehicle.unitNumber,
        machineType: vehicle.machineType,
        brandModelYear: vehicle.brandModelYear,
        machineSerialNumber: vehicle.machineSerialNumber,
        kilometers: vehicle.kilometers,
        engineSerialNumber: vehicle.technical.engineSerialNumber,
        partsAndFilters: vehicle.technical.partsAndFilters,
        legacyFilterAlias: vehicle.technical.filterPartNumbers
      };
    })()`);
    assert(editedVehicle.route === "truckDetails", "Edited vehicle should return to truck details");
    assert(editedVehicle.vehicleCount === 4, "Editing vehicle should not create a duplicate");
    assert(editedVehicle.unitNumber === "U-901", "Vehicle edit did not save unit number");
    assert(editedVehicle.machineType === "Chargeuse", "Vehicle edit did not save machine type");
    assert(editedVehicle.brandModelYear === "CAT 950M - 2023", "Vehicle edit did not save brand/model/year");
    assert(editedVehicle.machineSerialNumber === "CAT950M-23-901", "Vehicle edit did not save machine serial number");
    assert(editedVehicle.kilometers === 46200, "Vehicle edit did not save kilometers");
    assert(editedVehicle.engineSerialNumber === "ENG-901", "Vehicle edit did not save engine serial number");
    assert(editedVehicle.partsAndFilters === "P-99, F-100", "Vehicle edit did not save parts and filters");
    assert(editedVehicle.legacyFilterAlias === "P-99, F-100", "Vehicle edit should keep legacy filter alias synchronized");

    await evaluate(client, `(() => {
      const savedState = JSON.parse(localStorage.getItem('corb-fleet-manager-state-v2'));
      state.route = 'editService';
      state.activeServiceId = savedState.maintenancePlans[0].id;
      render();
    })()`);
    await new Promise((resolve) => setTimeout(resolve, 200));
    await evaluate(client, `(() => {
      const form = document.querySelector('[data-edit-service-form]');
      form.elements.title.value = 'Inspection hydraulique';
      form.elements.intervalDays.value = '45';
      form.elements.intervalKm.value = '12000';
      form.elements.dueDate.value = '2026-07-15';
      form.requestSubmit();
    })()`);
    await new Promise((resolve) => setTimeout(resolve, 250));
    const editedService = await evaluate(client, `(() => {
      const savedState = JSON.parse(localStorage.getItem('corb-fleet-manager-state-v2'));
      const service = savedState.maintenancePlans[0];
      return {
        route: savedState.route,
        serviceCount: savedState.maintenancePlans.length,
        title: service.title,
        intervalDays: service.scheduleRule.intervalDays,
        intervalKm: service.scheduleRule.intervalKm,
        dueDate: service.dueDate,
        scheduleType: service.scheduleType
      };
    })()`);
    assert(editedService.route === "serviceDetails", "Edited maintenance should return to service details");
    assert(editedService.serviceCount === 4, "Editing maintenance should not create a duplicate");
    assert(editedService.title === "Inspection hydraulique", "Maintenance edit did not save title");
    assert(editedService.intervalDays === 45, "Maintenance edit did not save interval days");
    assert(editedService.intervalKm === 12000, "Maintenance edit did not save interval KM");
    assert(editedService.dueDate === "2026-07-15", "Maintenance edit did not save due date");
    assert(editedService.scheduleType === "hybrid", "Maintenance edit should derive hybrid schedule type");

    await evaluate(client, `document.querySelector('[data-route="profile"]').click();`);
    await new Promise((resolve) => setTimeout(resolve, 200));
    await evaluate(client, `document.querySelector('[data-profile-tab="mechanics"]').click();`);
    await new Promise((resolve) => setTimeout(resolve, 200));
    const mechanicAccessPanel = await evaluate(client, `(() => ({
      hasAccessForm: !!document.querySelector('[data-create-mechanic-access-form]'),
      accessRows: document.querySelectorAll('.access-row').length,
      sendButtons: document.querySelectorAll('[data-send-access]').length,
      hasEmailField: !!document.querySelector('#mechanicAccessEmail')
    }))()`);
    assert(mechanicAccessPanel.hasAccessForm, "Owner mechanic access tab is missing access form");
    assert(mechanicAccessPanel.accessRows >= 1, "Owner mechanic access tab should list mechanic codes");
    assert(mechanicAccessPanel.sendButtons >= 1, "Owner mechanic access tab should expose send invite actions");
    assert(mechanicAccessPanel.hasEmailField, "Owner mechanic access form should collect mechanic email");

    await evaluate(client, `(() => {
      const form = document.querySelector('[data-create-mechanic-access-form]');
      form.elements.name.value = 'Sarah Garage';
      form.elements.email.value = 'sarah@example.com';
      form.elements.code.value = '135790';
      form.requestSubmit();
    })()`);
    await new Promise((resolve) => setTimeout(resolve, 200));
    const createdAccess = await evaluate(client, `(() => {
      const savedState = JSON.parse(localStorage.getItem('corb-fleet-manager-state-v2'));
      const access = savedState.mechanicAccessCodes[0];
      return {
        name: access.name,
        email: access.email,
        code: access.code,
        active: access.active,
        rowText: document.querySelector('.access-row')?.innerText || ''
      };
    })()`);
    assert(createdAccess.name === "Sarah Garage", "Mechanic access creation did not save mechanic name");
    assert(createdAccess.email === "sarah@example.com", "Mechanic access creation did not save mechanic email");
    assert(createdAccess.code === "135790", "Mechanic access creation did not save requested access code");
    assert(createdAccess.active === true, "Mechanic access creation should create an active access");
    assert(createdAccess.rowText.includes("sarah@example.com"), "Mechanic access row should show mechanic email");

    await openPage(client, `${baseUrl}/?route=login&language=fr&theme=dark&loginMode=mechanic`);
    await evaluate(client, `localStorage.removeItem('corb-fleet-manager-state-v2'); location.href='${baseUrl}/?route=login&language=fr&theme=dark&loginMode=mechanic';`);
    await new Promise((resolve) => setTimeout(resolve, 400));
    await evaluate(client, `document.querySelector('[data-auth-mode="mechanic"]')?.click();`);
    await new Promise((resolve) => setTimeout(resolve, 150));
    await evaluate(client, `document.querySelector('#mechanicCode').value='2468'; document.querySelector('[data-login-form]').requestSubmit();`);
    await new Promise((resolve) => setTimeout(resolve, 300));

    const mechanicHome = await evaluate(client, `(() => ({
      authMode: JSON.parse(localStorage.getItem('corb-fleet-manager-state-v2')).authMode,
      title: document.querySelector('.cockpit-hero h1')?.textContent,
      nav: [...document.querySelectorAll('.bottom-nav .nav-tab span:last-child')].map((item) => item.textContent.trim()),
      hasActions: !!document.querySelector('[data-toggle-create-menu]'),
      overflowX: document.documentElement.scrollWidth > window.innerWidth
    }))()`);
    assert(mechanicHome.authMode === "mechanic", "Mechanic login did not set mechanic auth mode");
    assert(mechanicHome.title.includes("Marc Tremblay"), "Mechanic greeting should use access-code identity");
    assert(mechanicHome.nav.length === 2 && !mechanicHome.nav.includes("Actions"), "Mechanic nav should be scoped");
    assert(!mechanicHome.hasActions, "Mechanic should not see owner actions");
    assert(!mechanicHome.overflowX, "Mechanic home has horizontal overflow");

    await evaluate(client, `document.querySelector('[data-complete-service]')?.click();`);
    await new Promise((resolve) => setTimeout(resolve, 200));
    const capture = await evaluate(client, `(() => {
      const input = document.querySelector('input[name="photos"]');
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(new File(['x'], 'e2e-photo.jpg', { type: 'image/jpeg' }));
      input.files = dataTransfer.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
      return {
        hasFiles: input.closest('.capture-card').classList.contains('has-files'),
        preview: input.closest('.capture-card').querySelector('.capture-preview')?.innerText || '',
        voiceBars: document.querySelectorAll('.voice-wave i').length
      };
    })()`);
    assert(capture.hasFiles, "Capture card did not enter selected-file state");
    assert(capture.preview.includes("e2e-photo.jpg"), "Capture preview did not show selected file");
    assert(capture.voiceBars === 5, "Voice button waveform is missing");

    const voice = await evaluate(client, `(() => {
      class FakeSpeechRecognition {
        constructor() {
          this.listeners = {};
          window.__fakeRecognition = this;
        }
        addEventListener(type, listener) {
          this.listeners[type] = listener;
        }
        start() {
          this.started = true;
        }
        stop() {
          this.listeners.result?.({
            results: [[{ transcript: 'Voice captured note' }]],
            resultIndex: 0
          });
          this.listeners.end?.();
        }
      }
      window.SpeechRecognition = FakeSpeechRecognition;
      window.webkitSpeechRecognition = FakeSpeechRecognition;
      const button = document.querySelector('[data-start-voice]');
      button.click();
      const listening = button.classList.contains('listening');
      button.click();
      return {
        listening,
        note: document.querySelector('textarea[name="mechanicNote"]').value
      };
    })()`);
    assert(voice.listening, "Voice button did not enter listening state");
    assert(voice.note.includes("Voice captured note"), "Voice transcript was not inserted on stop");

    await evaluate(client, `document.querySelector('textarea[name="mechanicNote"]').value='E2E mechanic note'; document.querySelector('[data-submit-completion]')?.click();`);
    await new Promise((resolve) => setTimeout(resolve, 200));
    const completion = await evaluate(client, `(() => {
      const state = JSON.parse(localStorage.getItem('corb-fleet-manager-state-v2'));
      const record = state.serviceRecords[0];
      return {
        completedByName: record.completedByName,
        completedByType: record.completedByType,
        note: record.mechanicNote,
        attachments: record.attachmentNames
      };
    })()`);
    assert(completion.completedByName === "Marc Tremblay", "Completion should be attributed to mechanic");
    assert(completion.completedByType === "mechanic", "Completion type should be mechanic");
    assert(completion.note === "E2E mechanic note", "Completion note was not saved");
    assert(completion.attachments.includes("e2e-photo.jpg"), "Completion attachment name was not saved");

    await evaluate(client, `state.route='serviceDetails'; state.activeServiceId='service-1'; state.activeCompletionId=null; render();`);
    await new Promise((resolve) => setTimeout(resolve, 200));
    const serviceDetail = await evaluate(client, `(() => ({
      scheduleTitle: document.querySelector('.schedule-card-head h2')?.textContent,
      lineCount: document.querySelectorAll('.completion-line-card').length,
      oldCards: document.querySelectorAll('.service-history-section .completion-card').length,
      overflowX: document.documentElement.scrollWidth > window.innerWidth
    }))()`);
    assert(serviceDetail.scheduleTitle, "Service detail schedule summary is missing");
    assert(serviceDetail.lineCount >= 1, "Service detail should show compact history rows");
    assert(serviceDetail.oldCards === 0, "Service detail should not show large completion cards");
    assert(!serviceDetail.overflowX, "Service detail has horizontal overflow");

    await evaluate(client, `document.querySelector('.completion-line-main')?.click();`);
    await new Promise((resolve) => setTimeout(resolve, 150));
    const expanded = await evaluate(client, `document.querySelector('.completion-line-details')?.innerText || ''`);
    assert(expanded.includes("Note") || expanded.includes("Détails"), "Completion row did not expand details");

    await evaluate(client, `state.route='truckDetails'; state.activeVehicleId='vehicle-1'; state.truckTab='history'; state.activeCompletionId=null; render();`);
    await new Promise((resolve) => setTimeout(resolve, 200));
    const truckHistory = await evaluate(client, `(() => ({
      cards: document.querySelectorAll('.truck-history-line').length,
      firstTitle: document.querySelector('.truck-history-line strong')?.textContent.trim() || '',
      firstBackground: getComputedStyle(document.querySelector('.truck-history-line')).backgroundColor,
      overflowX: document.documentElement.scrollWidth > window.innerWidth
    }))()`);
    assert(truckHistory.cards >= 1, "Truck history should show compact completion rows");
    assert(truckHistory.firstTitle.length > 0, "Truck history collapsed row should show service title");
    assert(truckHistory.firstBackground !== "rgba(0, 0, 0, 0)", "Truck history cards need an explicit surface");
    assert(!truckHistory.overflowX, "Truck history has horizontal overflow");

    await evaluate(client, `document.querySelector('.truck-history-line .completion-line-main')?.click();`);
    await new Promise((resolve) => setTimeout(resolve, 150));
    const truckHistoryExpanded = await evaluate(client, `(() => ({
      detailLabels: [...document.querySelectorAll('.completion-line-details span')].map((item) => item.textContent.trim()),
      attachments: [...document.querySelectorAll('.completion-attachment-list li strong')].map((item) => item.textContent.trim()),
      attachmentIcons: document.querySelectorAll('.completion-attachment-list .icon').length
    }))()`);
    assert(truckHistoryExpanded.detailLabels.some((label) => label.includes("Note")), "Truck history expansion should include mechanic note");
    assert(truckHistoryExpanded.attachments.length >= 1, "Truck history expansion should include attachments");
    assert(truckHistoryExpanded.attachmentIcons >= 1, "Truck history attachments should include file-type icons");

    const truckHistoryAllDetails = await evaluate(client, `(() => {
      document.querySelectorAll('.truck-history-line .completion-line-main').forEach((button) => {
        if (button.getAttribute('aria-expanded') === 'false') button.click();
      });
      return [...document.querySelectorAll('.completion-line-details span')].map((item) => item.textContent.trim());
    })()`);
    assert(truckHistoryAllDetails.some((label) => label.toLowerCase().includes("pièces") || label.toLowerCase().includes("parts")), "Truck history should support parts details when present");

    console.log("E2E smoke tests passed");
  } finally {
    if (client) client.close();
    chrome.kill();
    await new Promise((resolve) => {
      chrome.once("exit", resolve);
      setTimeout(resolve, 1000);
    });
    server.close();
    fs.rmSync(userDataDir, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
  }
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

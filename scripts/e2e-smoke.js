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

    await evaluate(client, `document.querySelector('[data-route="profile"]').click();`);
    await new Promise((resolve) => setTimeout(resolve, 200));
    await evaluate(client, `document.querySelector('[data-profile-tab="fleet"]').click();`);
    await new Promise((resolve) => setTimeout(resolve, 200));
    const fleetPanel = await evaluate(client, `(() => ({
      hasAccessForm: !!document.querySelector('[data-create-mechanic-access-form]'),
      accessRows: document.querySelectorAll('.access-row').length
    }))()`);
    assert(fleetPanel.hasAccessForm, "Owner fleet panel is missing mechanic access form");
    assert(fleetPanel.accessRows >= 1, "Owner fleet panel should list mechanic codes");

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
    await evaluate(client, `document.querySelector('textarea[name="mechanicNote"]').value='E2E mechanic note'; document.querySelector('[data-submit-completion]')?.click();`);
    await new Promise((resolve) => setTimeout(resolve, 200));
    const completion = await evaluate(client, `(() => {
      const state = JSON.parse(localStorage.getItem('corb-fleet-manager-state-v2'));
      const record = state.serviceRecords[0];
      return {
        completedByName: record.completedByName,
        completedByType: record.completedByType,
        note: record.mechanicNote
      };
    })()`);
    assert(completion.completedByName === "Marc Tremblay", "Completion should be attributed to mechanic");
    assert(completion.completedByType === "mechanic", "Completion type should be mechanic");
    assert(completion.note === "E2E mechanic note", "Completion note was not saved");

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

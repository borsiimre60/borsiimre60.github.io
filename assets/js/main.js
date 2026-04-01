const links = {
  home: "/",
  kozoskepviselok: "/kozoskepviselok/",
  kozoskepviseloForm:
    "https://docs.google.com/forms/d/e/1FAIpQLSfbSlrvX8jRNn0K3WF7z-yO2KEKpI40qX7tWSVVk0XNBhhh7A/viewform?usp=pp_url&entry.716565563=kozos_kepviselo_kampany",
  vendeglatohelyek: "/vendeglatohelyek/",
  szakemberek: "/szakemberek/",
  szakipush: "/szakipush-web/",
  villanyszereloVii: "/villanyszerelo-vii/",
  // Ide később egy dedikált villanyszerelő Google űrlap URL tehető be egy sor cserével.
  villanyszereloForm:
    "https://docs.google.com/forms/d/e/1FAIpQLSfbSlrvX8jRNn0K3WF7z-yO2KEKpI40qX7tWSVVk0XNBhhh7A/viewform?usp=pp_url&entry.716565563=villanyszerelo_vii_landing"
};

document.querySelectorAll("[data-link]").forEach((element) => {
  const key = element.getAttribute("data-link");
  if (key && links[key]) {
    element.setAttribute("href", links[key]);
  }
});

const yearTarget = document.getElementById("current-year");
if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

function hasTrackingValue(value) {
  if (value === undefined || value === null) {
    return false;
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  return true;
}

function compactObject(source) {
  return Object.fromEntries(
    Object.entries(source || {}).filter(([, value]) => hasTrackingValue(value))
  );
}

// Brevo tracker config
// Fontos: ide csak a Brevo nyilvános tracker client_key kerülhet.
// REST API kulcsot vagy más titkos kulcsot ne tegyél frontendbe.
const brevoExternalConfig = window.__BREVO_TRACKER_CONFIG__ || {};
const BREVO_TRACKER_CONFIG = {
  clientKey: "",
  sdkUrl: "https://cdn.brevo.com/js/sdk-loader.js",
  debug: false,
  page: document.body?.dataset.page || "",
  sourceLabel: document.body?.dataset.sourceLabel || "",
  ...brevoExternalConfig
};

const brevoTrackerState = {
  initQueued: false,
  scriptRequested: false
};

function isBrevoTrackerConfigured() {
  return hasTrackingValue(BREVO_TRACKER_CONFIG.clientKey);
}

function ensureBrevoTracker() {
  if (!isBrevoTrackerConfigured()) {
    return false;
  }

  window.Brevo = window.Brevo || [];

  if (!brevoTrackerState.initQueued) {
    window.Brevo.push([
      "init",
      {
        client_key: BREVO_TRACKER_CONFIG.clientKey.trim()
      }
    ]);
    brevoTrackerState.initQueued = true;
  }

  const existingSdk = document.querySelector(
    'script[src*="cdn.brevo.com/js/sdk-loader.js"]'
  );
  if (existingSdk) {
    brevoTrackerState.scriptRequested = true;
    return true;
  }

  if (!brevoTrackerState.scriptRequested) {
    const script = document.createElement("script");
    script.src = BREVO_TRACKER_CONFIG.sdkUrl;
    script.async = true;
    script.dataset.brevoTrackerSdk = "true";
    script.addEventListener("error", () => {
      if (BREVO_TRACKER_CONFIG.debug) {
        console.warn("Brevo tracker SDK betöltése sikertelen.");
      }
    });
    document.head.appendChild(script);
    brevoTrackerState.scriptRequested = true;
  }

  return true;
}

// Tracking helper
function trackBrevoEvent(eventName, options = {}) {
  if (!eventName || !ensureBrevoTracker()) {
    return false;
  }

  const properties = compactObject(options.properties || {});
  const eventMeta = compactObject({
    page: options.page || BREVO_TRACKER_CONFIG.page,
    section: options.section,
    target_type: options.targetType,
    source_label: options.sourceLabel || BREVO_TRACKER_CONFIG.sourceLabel,
    ...options.eventData
  });

  const command = ["track", eventName, properties];
  if (Object.keys(eventMeta).length > 0) {
    command.push({ data: eventMeta });
  }

  window.Brevo.push(command);
  return true;
}

// CTA tracking binding
function bindTrackedCtas() {
  document.querySelectorAll("[data-track-event]").forEach((element) => {
    element.addEventListener("click", () => {
      trackBrevoEvent(element.dataset.trackEvent, {
        section: element.dataset.trackSection,
        targetType: element.dataset.trackTargetType,
        sourceLabel: element.dataset.trackSourceLabel
      });
    });
  });
}

bindTrackedCtas();

const leadForm = document.getElementById("lead-form");
const formFeedback = document.getElementById("form-feedback");

if (leadForm) {
  let leadFormStarted = false;

  leadForm.addEventListener(
    "focusin",
    () => {
      if (leadFormStarted) {
        return;
      }

      leadFormStarted = true;
      trackBrevoEvent("lead_form_start", {
        section: "contact",
        targetType: "form"
      });
    },
    { once: true }
  );

  leadForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(leadForm);
    trackBrevoEvent("lead_form_submit_attempt", {
      section: "contact",
      targetType: "form",
      properties: compactObject({
        email: data.get("email")
      }),
      eventData: compactObject({
        property_type: data.get("propertyType"),
        urgency: data.get("urgency")
      })
    });

    const requiredConsent = data.get("consent");
    if (!requiredConsent) {
      if (formFeedback) {
        formFeedback.textContent =
          "A kapcsolatfelvételi hozzájárulás megadása szükséges.";
      }
      return;
    }

    const entries = [
      ["Név", data.get("name")],
      ["Telefonszám", data.get("phone")],
      ["E-mail", data.get("email")],
      ["Cím / kerület", data.get("district")],
      ["Ingatlan típusa", data.get("propertyType")],
      ["Sürgősség", data.get("urgency")],
      ["Leírás", data.get("description")]
    ].filter(([, value]) => value && String(value).trim().length > 0);

    const subjectProperty = data.get("propertyType") || "villanyszerelési megkeresés";
    const subject = `Új megkeresés - ${subjectProperty}`;
    const body = entries.map(([label, value]) => `${label}: ${value}`).join("\n");
    const href = `mailto:szakiszervizbp@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = href;

    if (formFeedback) {
      formFeedback.textContent =
        "Megnyílt az e-mail kliens az előkészített adatokkal. Ha gyorsabb, használja a telefonos vagy Google űrlapos gombokat.";
    }
  });
}

// Google Forms config
// Ha elkészül a dedikált "Villanyszerelő VII. kerület – hibabejelentés és munkaleadás"
// Google űrlap, ezt az egyetlen konstans URL-t kell lecserélni az új viewform linkre.
const ELECTRICIAN_VII_GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfbSlrvX8jRNn0K3WF7z-yO2KEKpI40qX7tWSVVk0XNBhhh7A/viewform?usp=pp_url&entry.716565563=villanyszerelo_vii_landing";

const links = {
  home: "/",
  kozoskepviselok: "/kozoskepviselok/",
  kozoskepviseloForm:
    "https://docs.google.com/forms/d/e/1FAIpQLSfbSlrvX8jRNn0K3WF7z-yO2KEKpI40qX7tWSVVk0XNBhhh7A/viewform?usp=pp_url&entry.716565563=kozos_kepviselo_kampany",
  vendeglatohelyek: "/vendeglatohelyek/",
  szakemberek: "/szakemberek/",
  szakipush: "/szakipush-web/",
  villanyszereloVii: "/villanyszerelo-vii/",
  villanyszereloForm: ELECTRICIAN_VII_GOOGLE_FORM_URL
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

function readTrackingContext(overrides = {}) {
  return compactObject({
    page: overrides.page || BREVO_TRACKER_CONFIG.page,
    section: overrides.section,
    target_type: overrides.targetType,
    source_label: overrides.sourceLabel || BREVO_TRACKER_CONFIG.sourceLabel,
    ...overrides.eventData
  });
}

// Brevo tracker config
// Fontos: ide csak a Brevo nyilvános tracker client_key kerülhet.
// REST API kulcsot vagy más titkos kulcsot ne tegyél frontendbe.
// Ha később lesz végleges Brevo tracking, ezt a clientKey mezőt töltsd ki.
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
  const eventMeta = readTrackingContext(options);

  const command = ["track", eventName, properties];
  if (Object.keys(eventMeta).length > 0) {
    command.push({ data: eventMeta });
  }

  window.Brevo.push(command);
  return true;
}

// GA4 tracking helper
// A gtag snippet külön kerülhet az oldalba, ha később GA4 mérés is kell.
function isGa4TrackerAvailable() {
  return typeof window.gtag === "function";
}

function trackGa4Event(eventName, options = {}) {
  if (!eventName || !isGa4TrackerAvailable()) {
    return false;
  }

  window.gtag("event", eventName, compactObject({
    ...readTrackingContext(options),
    ...options.properties
  }));

  return true;
}

function trackMarketingEvent(eventName, options = {}) {
  const brevoTracked = trackBrevoEvent(eventName, options);
  const ga4Tracked = trackGa4Event(eventName, options);
  return brevoTracked || ga4Tracked;
}

const trackingState = {
  landingViewTracked: false,
  leadStartTracked: false
};

function trackPhoneClick(options = {}) {
  return trackMarketingEvent("phone_click", {
    targetType: "phone",
    ...options
  });
}

function trackEmailClick(options = {}) {
  return trackMarketingEvent("email_click", {
    targetType: "email",
    ...options
  });
}

function trackGoogleFormClick(options = {}) {
  return trackMarketingEvent("google_form_click", {
    targetType: "google_form",
    ...options
  });
}

function trackLeadStart(options = {}) {
  if (trackingState.leadStartTracked) {
    return false;
  }

  trackingState.leadStartTracked = true;
  return trackMarketingEvent("lead_form_start", {
    targetType: "form",
    ...options
  });
}

function trackLeadSubmitAttempt(formData, options = {}) {
  return trackMarketingEvent("lead_form_submit_attempt", {
    targetType: "form",
    ...options,
    properties: compactObject({
      has_email: hasTrackingValue(formData?.get("email")) ? "yes" : "no"
    }),
    eventData: compactObject({
      property_type: formData?.get("propertyType"),
      urgency: formData?.get("urgency"),
      ...options.eventData
    })
  });
}

const trackingHandlers = {
  phone_click: trackPhoneClick,
  email_click: trackEmailClick,
  google_form_click: trackGoogleFormClick,
  lead_form_start: trackLeadStart
};

function buildTrackingOptions(element) {
  return {
    section: element.dataset.trackSection,
    targetType: element.dataset.trackTargetType,
    sourceLabel: element.dataset.trackSourceLabel
  };
}

// CTA tracking binding
function bindTrackedCtas() {
  document.querySelectorAll("[data-track-event]").forEach((element) => {
    const eventName = element.dataset.trackEvent;
    const handler = trackingHandlers[eventName];
    if (typeof handler !== "function") {
      return;
    }

    element.addEventListener("click", () => {
      handler(buildTrackingOptions(element));
    });
  });
}

bindTrackedCtas();

function trackLandingView() {
  if (trackingState.landingViewTracked) {
    return;
  }

  trackingState.landingViewTracked = true;
  trackMarketingEvent("landing_view", {
    eventData: compactObject({
      page_url: window.location.href,
      page_path: window.location.pathname
    })
  });
}

trackLandingView();

const leadForm = document.getElementById("lead-form");
const formFeedback = document.getElementById("form-feedback");

if (leadForm) {
  leadForm.addEventListener(
    "focusin",
    () => {
      trackLeadStart({
        section: "contact"
      });
    },
    { once: true }
  );

  leadForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(leadForm);
    trackLeadSubmitAttempt(data, {
      section: "contact"
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

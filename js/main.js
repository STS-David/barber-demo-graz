const locations = [
  {
    name: "Gentleman Barbershop Graz",
    address: "Idlhofgasse 72, 8020 Graz",
    hours: "Mo-Sa 09:00-20:00",
    schedule: {
      0: null,
      1: { open: "09:00", close: "20:00" },
      2: { open: "09:00", close: "20:00" },
      3: { open: "09:00", close: "20:00" },
      4: { open: "09:00", close: "20:00" },
      5: { open: "09:00", close: "20:00" },
      6: { open: "09:00", close: "20:00" }
    },
    phoneDisplay: "0681 10198861",
    phoneHref: "+4368110198861",
    mapsUrl: "https://maps.google.com/?q=Idlhofgasse+72,+8020+Graz"
  }
];

const dayNames = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

function timeToMinutes(value) {
  const [hours, minutes] = value.split(":").map(Number);
  return (hours * 60) + minutes;
}

function formatTime(value) {
  const [hours, minutes] = value.split(":").map(Number);
  return new Intl.DateTimeFormat("de-AT", {
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(2000, 0, 1, hours, minutes));
}

function getHeroStatus(location, now = new Date()) {
  const schedule = location.schedule || {};
  const today = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const todaysHours = schedule[today];

  if (todaysHours) {
    const openMinutes = timeToMinutes(todaysHours.open);
    const closeMinutes = timeToMinutes(todaysHours.close);

    if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
      return {
        isOpen: true,
        message: `Jetzt geoeffnet - bis ${formatTime(todaysHours.close)}`
      };
    }

    if (currentMinutes < openMinutes) {
      return {
        isOpen: false,
        message: `Gerade geschlossen - heute wieder ab ${formatTime(todaysHours.open)}`
      };
    }
  }

  for (let offset = 1; offset <= 7; offset += 1) {
    const nextDayIndex = (today + offset) % 7;
    const nextDayHours = schedule[nextDayIndex];

    if (!nextDayHours) continue;

    const dayLabel = offset === 1 ? "morgen" : `am ${dayNames[nextDayIndex]}`;
    return {
      isOpen: false,
      message: `Gerade geschlossen - wieder ${dayLabel} ab ${formatTime(nextDayHours.open)}`
    };
  }

  return {
    isOpen: false,
    message: "Gerade geschlossen"
  };
}

function formatHeroStatusForViewport(status) {
  if (window.innerWidth > 575.98) return status.message;

  if (status.isOpen) {
    return status.message.replace("Jetzt geoeffnet - bis ", "Geoeffnet bis ");
  }

  if (status.message.includes("heute wieder ab")) {
    return status.message.replace("Gerade geschlossen - heute wieder ab ", "Geschlossen · ");
  }

  if (status.message.includes("wieder morgen ab")) {
    return status.message.replace("Gerade geschlossen - wieder morgen ab ", "Geschlossen · morgen ");
  }

  return status.message.replace("Gerade geschlossen - wieder ", "Geschlossen · ");
}

function formatClosedStatusHtml(message) {
  let html = message;
  html = html.replace("Gerade geschlossen", 'Gerade <span class="status">geschlossen</span>');
  html = html.replace(/^Geschlossen/, '<span class="status">Geschlossen</span>');
  return html;
}

function initMobileNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");

  if (!toggle || !nav) return;

  const closeNav = () => {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Menue oeffnen");
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  };

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    toggle.setAttribute("aria-label", expanded ? "Menue oeffnen" : "Menue schliessen");
    nav.classList.toggle("is-open");
    document.body.classList.toggle("nav-open", !expanded);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 860) {
      closeNav();
    }
  });
}

function initHeaderScroll() {
  const header = document.querySelector("[data-header]");
  if (!header) return;

  const updateHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

function initHeroStatus() {
  const statusCard = document.querySelector("[data-status-card]");
  const statusText = document.querySelector("[data-open-status]");
  const featuredLocation = locations[0];

  if (!statusCard || !statusText || !featuredLocation) return;

  const updateStatus = () => {
    const status = getHeroStatus(featuredLocation);
    const formattedStatus = formatHeroStatusForViewport(status);

    if (status.isOpen) {
      statusText.textContent = formattedStatus;
    } else {
      statusText.innerHTML = formatClosedStatusHtml(formattedStatus);
    }

    statusCard.classList.toggle("is-open", status.isOpen);
    statusCard.classList.toggle("is-closed", !status.isOpen);
    statusText.style.setProperty("--typing-width", `${statusText.scrollWidth}px`);
  };

  updateStatus();
  window.setInterval(updateStatus, 60000);
  window.addEventListener("resize", updateStatus);
}

function renderLocations() {
  const container = document.getElementById("locations-grid");
  if (!container) return;

  container.innerHTML = "";

  locations.forEach((location) => {
    const article = document.createElement("article");
    article.className = "location-card";
    article.setAttribute("data-reveal", "");
    article.innerHTML = `
      <div class="location-card__top">
        <p class="location-card__label">Gentleman Barbershop Graz</p>
        <h3>${location.address}</h3>
      </div>
      <div class="location-card__meta">
        <div>
          <p class="location-card__label">Oeffnungszeiten</p>
          <p>${location.hours}</p>
        </div>
        <div>
          <p class="location-card__label">Telefon</p>
          <p>${location.phoneDisplay}</p>
        </div>
      </div>
      <div class="location-card__actions">
        <a class="btn btn-secondary btn-small" href="${location.mapsUrl}" target="_blank" rel="noreferrer">Route oeffnen</a>
        <a class="btn btn-primary btn-gold-outline btn-small" href="tel:${location.phoneHref}">Jetzt anrufen</a>
      </div>
    `;
    container.appendChild(article);
  });
}

function initScrollReveal() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const items = document.querySelectorAll("[data-reveal]");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  items.forEach((item) => observer.observe(item));
}

function setCurrentYear() {
  const yearNode = document.getElementById("current-year");
  if (!yearNode) return;
  yearNode.textContent = String(new Date().getFullYear());
}

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initHeaderScroll();
  initHeroStatus();
  renderLocations();
  initScrollReveal();
  setCurrentYear();
});

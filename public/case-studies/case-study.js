// Gemeinsames Script für alle Case Studies unter /case-studies/.
// Die Sprachlogik spiegelt src/services/TranslationService.ts:
// gleicher Storage-Key, Deutsch im HTML, Englisch in data-i18n-en.

const STORAGE_KEY = "portfolio-language";

function readStoredLanguage() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === "de" || stored === "en") return stored;
    } catch {
        // Speicher blockiert (z. B. privater Modus) → Browser-Sprache
    }
    return navigator.language.toLowerCase().startsWith("en") ? "en" : "de";
}

function setLanguage(language) {
    document.documentElement.lang = language;

    document.querySelectorAll("[data-i18n-en]").forEach((element) => {
        if (!element.dataset.i18nDe) {
            element.dataset.i18nDe = element.textContent ?? "";
        }
        element.textContent = language === "de" ? element.dataset.i18nDe : element.dataset.i18nEn;
    });

    const toggle = document.querySelector("#language-toggle");
    if (toggle) {
        toggle.textContent = language === "de" ? "EN" : "DE";
        toggle.setAttribute("aria-label", language === "de" ? "Seite auf Englisch anzeigen" : "Show page in German");
    }

    try {
        localStorage.setItem(STORAGE_KEY, language);
    } catch {
        // ignorieren
    }
}

function initLanguage() {
    let language = readStoredLanguage();
    setLanguage(language);

    document.querySelector("#language-toggle")?.addEventListener("click", () => {
        language = language === "de" ? "en" : "de";
        setLanguage(language);
    });
}

// Jeder direkte Baustein in <main> blendet beim Scrollen ein.
// Ohne JS oder mit reduzierter Bewegung bleibt alles sofort sichtbar.
function initReveal() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    }, { rootMargin: "0px 0px -10% 0px" });

    document.querySelectorAll("main > *").forEach((element) => {
        element.classList.add("cs-reveal");
        observer.observe(element);
    });
}

// Setzt .is-scrolled auf <html>, sobald die Seite nicht mehr ganz oben ist.
// .cs-back ist per CSS sticky; die Klasse steuert nur den Glas-Look.
function initScrollState() {
    const update = () => document.documentElement.classList.toggle("is-scrolled", window.scrollY > 24);
    window.addEventListener("scroll", update, { passive: true });
    update();
}

initLanguage();
initReveal();
initScrollState();

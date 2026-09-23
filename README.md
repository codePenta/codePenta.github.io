# codePenta — Portfolio

Persönliche Portfolio- und Projektübersichtsseite. Läuft live unter [pentanet.work](https://pentanet.work), gehostet über GitHub Pages.

Die Seite lädt Projektmetadaten von GitHub, filtert sie nach Sprache, und zeigt sie in einem responsiven Bento-artigen Layout — mit einer kontextsensitiven Navigation, die sich abhängig vom sichtbaren Bereich verändert, und vollständiger DE/EN-Zweisprachigkeit.

## Tech-Stack

- **Vanilla TypeScript** + **Vite** — kein UI-Framework, bewusst
- **GitHub REST API** — Repo-Daten holt ein Node-Skript in GitHub Actions per `fetch` (nicht zur Laufzeit im Browser)
- **GitHub Actions** — Build & Deploy auf GitHub Pages
- **Yarn 4 (Berry)** als Package Manager

## Quick Start

```bash
yarn install
yarn dev
```

## Scripts

| Befehl         | Zweck                                              |
| -------------- | -------------------------------------------------- |
| `yarn dev`     | Lokaler Vite-Dev-Server                            |
| `yarn build`   | Produktions-Build nach `dist/`                     |
| `yarn preview` | Baut lokal aus, was `dist/` nach dem Build enthält |

Die Projektdaten aktualisiert `.github/workflows/update.yml` täglich: `scripts/fetchers/fetchRepos.js` schreibt sie nach `public/data/projects.json` und committet sie bei Änderungen. Der Build liest nur diese Datei. Lokal aktualisieren: Token als `REPOSITORY_FETCH_TOKEN` in eine `.env` schreiben, dann `node scripts/fetchers/fetchRepos.js`.

## Deployment

Der reguläre Weg läuft komplett über **GitHub Actions** (`.github/workflows/deploy.yml`): Jeder Push auf `main` baut das Projekt frisch und lädt `dist/` als Pages-Artefakt hoch. **Repo → Settings → Pages → Source** muss auf "GitHub Actions" stehen, nicht auf "Deploy from a branch".

Custom Domain: `pentanet.work`, per `public/CNAME` + vier `A`-Records (`185.199.108.153` – `185.199.111.153`) und vier `AAAA`-Records auf die GitHub-Pages-IPs konfiguriert.

## Struktur

```text
.
├── documentation/                    # Mermaid-Diagramme + Architektur-Notizen
├── public/
│   ├── assets/                       # Farbpalette
│   ├── data/projects.json            # Von scripts/fetchers generierte Projektdaten
│   └── CNAME                         # Custom-Domain-Konfiguration für GitHub Pages
├── scripts/
│   ├── fetchers/                     # Holt Repo-Daten von der GitHub-API
│   ├── processors/                   # Mapped Rohdaten aufs App-Modell, schreibt projects.json
│   └── utils/                        # Konstanten (Token, API-URL, Ausgabepfad)
├── src/
│   ├── assets/icons/                 # Sprach- und Version-Control-Icons (per import.meta.glob)
│   ├── api/github/                   # Entities, Mapper, Service für GitHub-Projektdaten
│   ├── features/
│   │   ├── navigation/               # NavigationController, NavLink, readSectionsFromDom
│   │   └── projects/                 # ProjectCard, ProjectList
│   ├── services/
│   │   ├── IconService.ts            # Sprache/Tool → Icon-URL
│   │   ├── TranslationService.ts     # DE/EN-Umschaltung über data-i18n-*-Attribute
│   │   └── web/
│   │       ├── observers/            # IntersectionObserver für Scroll-basierte Nav-Aktivierung
│   │       └── provider/FilterProvider.ts
│   ├── shared/                       # Helpers.ts, constants.ts — aktuelle, genutzte Version
│   ├── styles/
│   │   ├── core.css                  # Farb-Variablen, Basis-Reset
│   │   ├── main.css                  # Layout, Sections, Buttons
│   │   └── components/               # navbar.css, projects.css
│   ├── index.ts                      # App-Bootstrap
│   └── store.ts                      # Zentraler App-State (Projekte, Filter)
├── index.html
├── vite.config.ts
└── package.json
```

## Navigation — Kernkonzept

Eine einzige `NavigationController`-Instanz rendert sowohl die Desktop-Sidebar-Nav als auch das Mobile-Bottom-Sheet aus denselben Daten (`buildNavItems()`), statt zwei separate Render-Pfade zu pflegen. Sections werden nicht hartcodiert, sondern zur Laufzeit aus `<section data-nav-label="...">`-Attributen im DOM gelesen (`readSectionsFromDom.ts`) — die `index.html` bleibt damit die einzige Quelle für Struktur und Reihenfolge der Navigation.

Beim Betreten einer als `data-nav-expandable="true"` markierten Section (aktuell: Projects) klappt die Nav zu Heading + Sprach-Filter-Liste um; alle anderen Sections bleiben als direkt anklickbare Links erreichbar. Aktivierung läuft sowohl über Klick als auch über einen `IntersectionObserver` beim Scrollen; beides aktualisiert konsistent Browser-History (`pushState` bei bewusster Navigation, `replaceState` beim Scroll) und den URL-Hash.

## Mehrsprachigkeit

Deutsch ist die Default-Sprache und liegt als echter, sichtbarer Text im HTML (kein Framework, kein JSON-Wörterbuch). Englische Übersetzungen liegen als `data-i18n-en`-Attribut auf demselben Element; `TranslationService.ts` tauscht den `textContent` beim Umschalten aus und merkt sich die Wahl in `localStorage`.
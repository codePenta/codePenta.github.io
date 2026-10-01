# Bugfix-Protokoll: Navbar ↔ Scroll-Synchronisation

Branch: `fix/nav-scroll-sync`

## Gemeldete Use Cases

1. **Navbar reagiert beim Scrollen teilweise nicht** – z. B. von *Über mich* nach *Projekte*, die Navbar bleibt stehen.
2. **Mobile: Filter wählen springt eine Section weiter** – in *Projekte* auf „TypeScript" getippt, stattdessen landet man (gefühlt) eine Section tiefer.

---

## Ursache 1 – Observer hat nur den aktuellen Batch ausgewertet

`IntersectionObserver` meldet **Zustandswechsel**, nicht den Gesamtzustand. Der alte Callback hat nur
`entries.find(e => e.isIntersecting)` geprüft.

Das Band (10 % um die Bildmitte) liegt beim Übergang kurz auf **beiden** Sections. Dreht man genau dann
die Scrollrichtung um (passiert beim Wischen auf dem Handy ständig), kommt als nächstes nur noch das Event
„Projects verlässt das Band". Darin ist nichts `isIntersecting` → **es wird gar nichts gemeldet** →
die Navbar bleibt auf *Projekte*, obwohl man in *Über mich* ist. Deshalb „teilweise".

Nachgestellt mit einer kleinen Simulation (gleiche Event-Folge in beiden Varianten):

| | Tatsächlich | Alt | Neu |
|---|---|---|---|
| Aktive Section | about | projects ❌ | about ✅ |

**Fix:** Observer merkt sich in einem `Set`, welche Sections gerade im Band liegen, und leitet die aktive
Section aus diesem Gesamtzustand ab (erste in Dokument-Reihenfolge).

## Ursache 2 – Filter verändert die Seitenhöhe

Ein Filter macht die Projektliste kürzer (9 → 2 Karten). Alles darunter (*Kontakt*) rutscht nach oben,
bzw. der Browser klemmt die Scrollposition, weil die Seite plötzlich kürzer ist. Der Observer sieht
*Kontakt* in der Bildmitte → Navbar wechselt weg vom Filter. Für dich sieht das aus wie „eine Section
weiter gescrollt".

**Fix:** Beim Filtern wird der Observer kurz gesperrt, die Liste neu gerendert und – falls man schon
in der Section „drin" war – der Anfang der Projekt-Section wieder ins Bild geholt.

## Ursache 3 – `scrollIntoView` auf den aktiven Chip (Verstärker für Ursache 2)

`chip.scrollIntoView()` scrollt **alle** scrollbaren Vorfahren – je nach Browser (v. a. iOS Safari)
also auch die Seite. `render()` läuft bei jedem Section-Wechsel, auch wenn das Sheet zugeklappt
unterhalb des Viewports hängt. Der Browser will den Chip dann „ins Bild holen" → Seite springt.

**Fix:** Nur die horizontale Chip-Leiste wird gescrollt (`scroller.scrollTo({ left })`).

## Ursache 4 – Navigation hing am Erfolg des Datenladens (Robustheit)

Observer + Nav-Render lagen im `try` nach `projectRepository.load()`. Schlägt das Laden fehl, wurde
der Observer nie gestartet. Jetzt startet die Navigation immer.

## Zusätzlich: Scroll-Lock bei programmatischem Scrollen

Klickt man einen Nav-Link, fährt das Smooth-Scroll über andere Sections hinweg. Vorher hat der
Observer dabei jede Zwischen-Section aktiviert (Flackern, unnötige History-Updates). Jetzt:

- Während *wir* scrollen, merkt sich der Controller nur, was der Observer meldet (`lastObservedSectionId`).
- Nach Scroll-Ende (`waitForScrollEnd`) wird einmal abgeglichen. Der Observer bleibt die Wahrheit für
  „wo bin ich", ein Klick ist nur die Absicht.
- `waitForScrollEnd` nutzt `scrollend`, mit Fallback „150 ms kein Scroll-Event", weil ältere Safari-
  Versionen `scrollend` nicht kennen und es nie feuert, wenn gar nicht gescrollt werden muss.

## Geänderte Dateien

| Datei | Änderung |
|---|---|
| `src/services/web/observers/IntersectionObserver.ts` | Zustand über Callbacks hinweg (`Set`) |
| `src/features/navigation/NavigationController.ts` | Scroll-Lock, Abgleich nach Scroll-Ende, Filter-Fix, Chip-Zentrierung ohne `scrollIntoView` |
| `src/shared/Helpers.ts` | `waitForScrollEnd()` |
| `src/index.ts` | Navigation startet unabhängig vom Laden der Projekte |

## Getestet / nicht getestet

- ✅ `tsc --noEmit` und `vite build` laufen fehlerfrei.
- ✅ Observer-Logik (Ursache 1) per Simulation nachgestellt.
- ⚠️ **Nicht** in einem echten Browser getestet (kein Browser in meiner Umgebung). Bitte durchklicken:

**Checkliste**
- [ ] Desktop: Home → Über mich → Projekte → Kontakt langsam scrollen, Navbar folgt.
- [ ] Desktop: Auf der Grenze Über mich/Projekte hin- und herscrollen, Navbar zeigt immer die richtige Section.
- [ ] Nav-Link „Kontakt" aus Home klicken: Navbar springt nicht durch alle Zwischen-Sections.
- [ ] Mobile: In Projekte weit runterscrollen, Sheet öffnen, „TypeScript" wählen → bleibt in Projekte, Filter bleibt sichtbar.
- [ ] Mobile: Mehrere Filter nacheinander antippen, Chip-Leiste zentriert den aktiven Chip, Seite springt nicht.
- [ ] Deep-Link `#projects/TypeScript` direkt aufrufen.

## Nebenbefunde (nicht angefasst)

- `scroll-snap-type: y mandatory` auf `html, body` in `main.css`, aber keine Section hat `scroll-snap-align` → wirkungslos. Entweder Snap-Punkte ergänzen oder entfernen.
- Labels werden doppelt aus dem DOM nachgezogen (in `render()` **und** `buildNavItems()`).
- Die Hero-Buttons (`<a href="#projects">`) laufen am Controller vorbei (normaler Anker-Sprung, kein `pushState`). Funktioniert über den Observer, ist aber ein zweiter Weg.

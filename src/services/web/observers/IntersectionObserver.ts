import { SectionConfig } from '../../../features/navigation/Types';
import { NavigationController } from '../../../features/navigation/NavigationController';

export class Observer
{
    private scrollObserver: IntersectionObserver;

    /**
     * FIX (Scroll-Sync): Merkt sich über ALLE Callbacks hinweg, welche Sections gerade im Band liegen.
     *
     * Vorher wurde nur der aktuelle Callback-Batch ausgewertet (`entries.find(e => e.isIntersecting)`).
     * Der IntersectionObserver meldet aber nur Zustands-WECHSEL, nicht den Gesamtzustand.
     * Liegt das Band genau auf der Grenze zweier Sections (beide "intersecting") und der Nutzer
     * dreht die Scrollrichtung um, enthält der nächste Batch nur noch ein "verlässt das Band"-Event.
     * Darin ist nichts `isIntersecting` → es wurde gar nichts gemeldet → Navbar blieb auf der falschen Section stehen.
     */
    private intersectingIds = new Set<string>();

    constructor(private navigationController: NavigationController, private sections: SectionConfig[])
    {
        // Schmales Band (10 % Höhe) um die Bildschirmmitte – funktioniert unabhängig davon, wie hoch eine Section ist.
        this.scrollObserver = new IntersectionObserver(this.callback, {
            rootMargin: "-45% 0px -45% 0px",
            threshold: 0,
        });
    }

    private callback = (entries: IntersectionObserverEntry[]) =>
    {
        entries.forEach(entry =>
        {
            if (entry.isIntersecting) this.intersectingIds.add(entry.target.id);
            else this.intersectingIds.delete(entry.target.id);
        });

        // Aus dem GESAMTZUSTAND ableiten, nicht aus dem Batch:
        // erste Section (Dokument-Reihenfolge), die das Band gerade berührt.
        const current = this.sections.find(section => this.intersectingIds.has(section.id));

        // Liegt das Band in einer Lücke (z. B. Footer), bleibt die zuletzt aktive Section stehen.
        if (current)
        {
            this.navigationController.onSectionActivate(current.id, true);
        }
    };

    public observeSections(): void
    {
        this.sections.forEach(section =>
        {
            const el = document.getElementById(section.id);
            if (el) this.scrollObserver.observe(el);
        });
    }
}

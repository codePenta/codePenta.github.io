import { SectionConfig } from '../../../features/navigation/Types';
import { NavigationController } from '../../../features/navigation/NavigationController';

export class Observer
{
    private scrollObserver: IntersectionObserver;

    private intersectingIds = new Set<string>();

    constructor(private navigationController: NavigationController, private sections: SectionConfig[])
    {
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

        const current = this.sections.find(section => this.intersectingIds.has(section.id));

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

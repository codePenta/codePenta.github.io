import { SectionConfig } from '../../../features/navigation/Types';
import { NavigationController } from '../../../features/navigation/NavigationController';

export class Observer
{
    private scrollObserver: IntersectionObserver;

    constructor(private navigationController: NavigationController, private sections: SectionConfig[])
    {
        this.scrollObserver = new IntersectionObserver(this.callback, {
            rootMargin: "-45% 0px -45% 0px",
            threshold: 0,
        });
    }

    private callback = (entries: IntersectionObserverEntry[]) =>
    {
        const visible = entries.find(entry => entry.isIntersecting);
        if (visible)
        {
            this.navigationController.onSectionActivate(visible.target.id, true);
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
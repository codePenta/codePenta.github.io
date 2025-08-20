import { Tags } from "../../../constants";
import { loadProjectsIntoNavbar, unloadProjectsFromNavbar } from "../provider/NavContentProvider";

class Observer
{
    private previousEntryId: string = "";
    private options = {
        threshold: 0.5,
    }

    private sections: Tags[] = [
        Tags.OBSERVER_PROJECT_SECTION
    ]

    private scrollObserver: IntersectionObserver;

    constructor()
    {
        this.scrollObserver = new IntersectionObserver(this.callback, this.options);
    }

    private callback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) =>
    {
        entries.forEach((entry: any) =>
        {
            if (entry.isIntersecting)
            {
                const currentSectionId = entry.target.id;
                if (currentSectionId !== this.previousEntryId)
                {
                    if (this.sections.includes(`#${currentSectionId}`))
                    {
                        loadProjectsIntoNavbar();
                        window.history.pushState(entry.target.textContent, "Title", `#${entry.target.id}`);
                    }
                    else
                    {
                        unloadProjectsFromNavbar();
                        window.history.pushState(entry.target.textContent, "Title", "/");
                    }

                    this.previousEntryId = currentSectionId;
                }
            }
        });
    };

    public get get(): IntersectionObserver
    {
        return this.scrollObserver;
    }

    observeSections()
    {
        document.querySelectorAll('section').forEach(section =>
        {
            this.get.observe(section)
        });
    }
}

export
{
    Observer
}

import { state } from "../../../store";
import { Tags } from "../../../utils/constants";
import { ContentProvider } from "../provider/NavContentProvider";

export class Observer
{
    private previousEntryId: string = "";
    private options = {
        threshold: 0.5,
    }

    private sections: Tags[] = [
        Tags.OBSERVER_PROJECT_SECTION
    ]

    private navContentProvider;
    private scrollObserver: IntersectionObserver;

    constructor()
    {
        this.scrollObserver = new IntersectionObserver(this.callback, this.options);
        this.navContentProvider = new ContentProvider();
    }

    private callback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) =>
    {
        entries.forEach((entry: any) =>
        {
            if (entry.isIntersecting)
            {
                const currentSectionId = entry.target.id;
                state.previousSection = this.previousEntryId;

                if (currentSectionId !== this.previousEntryId)
                {
                    if (this.sections.includes(`#${currentSectionId}`))
                    {
                        this.navContentProvider.loadProjectsIntoNavbar();
                        window.history.pushState(entry.target.textContent, "Title", `#${entry.target.id}`);
                    }
                    else
                    {
                        this.navContentProvider.unloadProjectsFromNavbar();
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

    public observeSections()
    {
        document.querySelectorAll('section').forEach(section =>
        {
            this.get.observe(section)
        });
    }
}
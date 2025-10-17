
import { state } from "../../../store";
import { Tags } from "../../../utils/constants";
import { ContentProvider } from "../provider/NavContentProvider";

export class Observer
{
    private previousEntryId: string = "";
    private sections: Element[] = []
    private triggerSections: Tags[] = [
        Tags.OBSERVER_PROJECT_SECTION
    ]
    currentSectionId: number = -1;

    private options = {
        threshold: 0.5,
    }

    private navContentProvider;
    private scrollObserver: IntersectionObserver;

    constructor()
    {
        this.scrollObserver = new IntersectionObserver(this.callback, this.options);
        this.navContentProvider = new ContentProvider();
    }

    private callback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) =>
    {
        const currentEntry = entries.find(entry => entry.isIntersecting);

        if (currentEntry)
        {
            const currentSectionId = currentEntry.target.id;

            state.previousSection = this.previousEntryId;
            const newSectionId = this.sections.findIndex(section => section.id === currentSectionId);

            if (currentSectionId !== this.previousEntryId)
            {
                if (this.triggerSections.includes(`#${currentSectionId}`))
                {
                    this.navContentProvider.loadProjectsIntoNavbar(this);
                    window.history.pushState(currentEntry.target.textContent, "Title", `#${currentEntry.target.id}`);
                }
                else
                {
                    this.navContentProvider.unloadProjectsFromNavbar();
                    window.history.pushState(currentEntry.target.textContent, "Title", "/");
                }

                this.previousEntryId = currentSectionId;
                this.currentSectionId = newSectionId;
            }
        }
    };

    public get get(): IntersectionObserver
    {
        return this.scrollObserver;
    }

    public HasNext(): boolean
    {
        return this.currentSectionId < this.sections.length - 1;
    }

    public HasPrevious(): boolean
    {
        return this.currentSectionId > 0;
    }

    public goToNext()
    {
        if (this.HasNext())
        {
            this.currentSectionId++;
            this.sections[this.currentSectionId].scrollIntoView({ behavior: 'smooth' });
        }
    }

    public goToPrevious()
    {
        if (this.HasPrevious())
        {
            this.currentSectionId--;
            this.sections[this.currentSectionId].scrollIntoView({ behavior: 'smooth' });
        }
    }

    public getCurrentSectionName(): string
    {
        return this.sections[this.currentSectionId].id;
    }

    public getSectionNameByIndex(index: number): string | undefined
    {
        if (index >= 0 && index < this.sections.length)
        {
            return this.sections[index].id;
        }

        return undefined;
    }

    public observeSections()
    {
        this.sections = Array.from(document.querySelectorAll('section'));
        this.sections.forEach(section =>
        {
            this.get.observe(section)
        });
    }
}
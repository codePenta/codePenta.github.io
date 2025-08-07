import { loadProjectsIntoNavbar, unloadProjectsFromNavbar } from "../provider/NavContentProvider";
import { state } from "../../../store";

var previousEntryId: string = "";

const options = {
    threshold: 0.5,
};

const callback = (entries: any, observer: any) =>
{
    entries.forEach((entry: any) =>
    {
        if (entry.isIntersecting)
        {
            if (entry.target.id == 'projects')
            {
                loadProjectsIntoNavbar();
                window.history.pushState(entry.target.textContent, "Title", `#${entry.target.id}`);
            }
            else
            {
                unloadProjectsFromNavbar();
                window.history.pushState(entry.target.textContent, "Title", "/");
            }
        }
    });
};

const scrollObserver = new IntersectionObserver(callback, options);

export function observeSections()
{
    document.querySelectorAll('section').forEach(section =>
    {
        scrollObserver.observe(section)
    });
}
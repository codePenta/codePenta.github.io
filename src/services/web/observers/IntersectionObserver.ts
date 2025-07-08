import { loadProjectsIntoNavbar, unloadProjectsFromNavbar } from "../provider/NavContentProvider";

const options = {
    threshold: 0.1,
};

const callback = (entries: any, observer: any) =>
{
    entries.forEach((entry: any) =>
    {
        if (entry.isIntersecting) // Is target visible
        {
            if (entry.target.id == 'projects-section')
                loadProjectsIntoNavbar();
            else
                unloadProjectsFromNavbar();
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
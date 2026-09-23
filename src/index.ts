import { Observer } from "./services/web/observers/IntersectionObserver";
import { NavigationController } from './features/navigation/NavigationController';
import { ProjectList } from "./features/projects/ProjectList";
import { state, updateState } from './store';
import { fetchProjects } from './api/github/services/projectsAPI';
import { renderGlobalError } from "./shared/Helpers";
import { Tags } from "./shared/constants";
import { TranslationService } from './services/TranslationService';
import { Filter } from "./api/github/entities/Filter";
import { readSectionsFromDom } from "./features/navigation/ReadSectionsFromDom";

const projectsList = document.querySelector(Tags.PROJECTS_LIST_ID);

export class App
{
    private navigationController: NavigationController;
    private observer: Observer;
    private translationService = new TranslationService();

    constructor()
    {
        this.translationService.initialize();
        const sections = readSectionsFromDom();
        this.navigationController = new NavigationController(sections);
        this.observer = new Observer(this.navigationController, sections);

        document.getElementById('language-toggle')?.addEventListener('click', () =>
        {
            this.translationService.toggle();
            if (projectsList)
            {
                const hash = window.location.hash.replace('#', '');
                const [sectionId, filterName] = hash.split('/');
                const filter: Filter | undefined = state.filter.find(f => f.name === filterName);
                if (filter)
                    new ProjectList().renderProjectList({ projects: filter.content });
                else
                    new ProjectList().renderProjectList({ projects: state.projects });
            }
            this.navigationController.render();
        });

        const footerYear = document.getElementById('footer-year');
        if (footerYear) footerYear.textContent = String(new Date().getFullYear());

        document.getElementById('footer-top-link')?.addEventListener('click', (event) =>
        {
            event.preventDefault();
            this.navigationController.scrollTo('home');
        });
    }

    async initialize()
    {
        console.log("Initializing application...");
        try
        {
            const initialProjects = await fetchProjects();
            updateState(initialProjects);

            if (projectsList)
            {
                new ProjectList().renderProjectList({ projects: state.projects });
            }

            this.navigationController.initFromLocation();
            document.getElementById(this.navigationController.getActiveSectionId())
                ?.scrollIntoView({ behavior: 'auto' });

            this.navigationController.render();
            this.observer.observeSections();
        } catch (error)
        {
            renderGlobalError(projectsList, error);
        }

        console.log("Application initialized.");
    }
}

document.addEventListener("DOMContentLoaded", () => new App().initialize());
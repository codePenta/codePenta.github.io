import { Project } from '../src/api/github/entities/ProjectEntity';
import { Filter } from './api/github/entities/FilterEntity';
import { createFilters } from './services/web/provider/FilterProvider';

export type AppState = {
    projects: Project[];
    navbarLinks: { name: string; href: string, ignoredByObserver: boolean }[];
    filter: Filter[];
    selectedFilter: string;
};

export const state: AppState = {
    projects: [],
    navbarLinks: [
        { name: "Home", href: "#home", ignoredByObserver: false },
        { name: "Projects", href: "#projects", ignoredByObserver: false },
    ],
    filter: [],
    selectedFilter: "",
};

export function updateState(newProjects: Project[])
{
    state.projects = newProjects;
    state.filter = createFilters(newProjects);
    console.log(state.filter);

}
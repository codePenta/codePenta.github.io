import { Project } from './api/github/entities/Project';
import { Filter } from './api/github/entities/Filter';
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
}
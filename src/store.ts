import { Project } from '../src/api/github/entities/ProjectEntity';
import { Filter } from './api/github/entities/FilterEntity';

export type AppState = {
    projects: Project[];
    navbarLinks: { name: string; href: string, ignoredByObserver: boolean }[];
    filter: Filter[]
};

export const state: AppState = {
    projects: [],
    navbarLinks: [
        { name: "Home", href: "#home", ignoredByObserver: false },
        { name: "Projects", href: "#projects", ignoredByObserver: false },
    ],
    filter: [],
};

export function updateState(newProjects: Project[])
{
    state.projects = newProjects;
    state.filter = Array.from(
        new Set(newProjects.map(project => project.language).filter(Boolean))
    ).map(language => Filter.createFilter(language, newProjects));

    console.log(state.filter);

}
import { Project } from '../src/api/github/entities/ProjectEntity';

export type AppState = {
    projects: Project[];
    navbarLinks: { name: string; href: string, ignoredByObserver: boolean }[];
    clickedProject: string;
};

export const state: AppState = {
    projects: [],
    navbarLinks: [
        { name: "Home", href: "#home", ignoredByObserver: false },
        { name: "Projects", href: "#projects", ignoredByObserver: false },
    ],
    clickedProject: "",
};

export function updateProjects(newProjects: Project[])
{
    state.projects = newProjects;
}
import { Project } from '../src/api/github/entities/ProjectEntity';

export type AppState = {
    projects: Project[];
    navbarLinks: { name: string; href: string }[];
};

export const state: AppState = {
    projects: [],
    navbarLinks: [
        { name: "Home", href: "#home" },
        { name: "Projects", href: "#projects-section" },
        { name: "Career", href: "#career" }
    ]
};

export function updateProjects(newProjects: Project[])
{
    state.projects = newProjects;
    state.navbarLinks = newProjects.map(p => ({ name: p.name, href: p.url }));
}
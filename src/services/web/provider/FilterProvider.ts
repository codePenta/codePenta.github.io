import { Project } from "../../../api/github/entities/ProjectEntity";
import { Filter } from "../../../api/github/entities/FilterEntity";

// Erstelle eine Liste aller eindeutigen Sprachen aus den Projekten
export function createFilters(projects: Project[]): Filter[]
{
    const languages = [...new Set(projects.map(p => p.language).filter(Boolean))] as string[];

    const allFilter = new Filter('all', projects);

    const languageFilters = languages.map(lang => Filter.createFilter(lang, projects));

    return [allFilter, ...languageFilters];
}
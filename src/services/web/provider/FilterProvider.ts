import { Project } from "../../../api/github/entities/Project";
import { Filter } from "../../../api/github/entities/Filter";
import { FilterConstants } from "../../../utils/constants";

export function createFilters(projects: Project[]): Filter[]
{
    const languages = [...new Set(projects.map(p => p.language).filter(Boolean))] as string[];

    const allFilter = new Filter(FilterConstants.DEFAULT_FILTER_STATE, projects);

    const languageFilters = languages.map(lang => Filter.create(lang, projects));

    return [allFilter, ...languageFilters];
}
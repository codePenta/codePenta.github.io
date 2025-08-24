export class FilePaths
{
    static readonly PROJECTS_DATA_PATH = "/data/projects.json";
}

export class Tags
{
    // Project tags
    static readonly PROJECTS_LIST_ID = "#projects-list";
    static readonly PROJECT_CARD_CLASSNAME = ".project-card";
    static readonly PROJECT_CARD_HEADING = ".project-card-heading";
    static readonly PROJECT_CARD_DETAILS = ".project-card-details";
    static readonly PROJECT_CARD_FOOTER = ".project-card-footer";
    static readonly PROJECT_AUTHOR_CLASSNAME = ".author-img-container";

    // Error tags
    static readonly ERROR_NO_PROJECTS_CLASSNAME = ".no-projects-message";

    // For observers
    static readonly OBSERVER_PROJECT_SECTION = "#projects";
}

export const formatWithoutPrefix = (value: string) =>
{
    return value.substring(1, value.length);
}
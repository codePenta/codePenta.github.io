export class FilePaths
{
    static readonly PROJECTS_DATA_PATH = "/data/projects.json";
    static readonly PROJECTS_I18N_PATH = "";
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

    static readonly NAVBAR_LIST_SELECTOR = "nav ul";
    static readonly MOBILE_SHEET_LIST_SELECTOR = ".mobile-nav-sheet .sheet-list";
}

export class FilterConstants
{
    static readonly DEFAULT_FILTER_STATE = 'All';
}

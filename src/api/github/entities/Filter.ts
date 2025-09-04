import { Project } from "./Project";

export class Filter
{
    constructor(public readonly filterName: string, public readonly filteredContent: Project[])
    { }

    static create(language: string, projects: Project[]): Filter
    {
        return new Filter(
            language,
            projects.filter(project => project.language === language),
        )
    }

    get count(): number
    {
        return this.filteredContent.length;
    }
}
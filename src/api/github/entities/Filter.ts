import { Project } from "./Project";

export class Filter
{
    constructor(public readonly name: string, public readonly content: Project[])
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
        return this.content.length;
    }
}
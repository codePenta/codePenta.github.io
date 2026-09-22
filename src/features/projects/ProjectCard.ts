import { Project } from '../../api/github/entities/Project';
import { Tags } from '../../shared/constants';
import { removePrefixFromTag as removePrefix } from '../../shared/Helpers';

export class ProjectCard
{
    public createProjectCard(project: Project): HTMLElement
    {
        const cardHeading: HTMLDivElement = this.buildHeader(project);
        const cardContent: HTMLDivElement = this.buildContent(project);
        const cardFooter: HTMLDivElement = this.buildFooter(project);

        const card: HTMLDivElement = this.buildCard(cardHeading, cardContent, cardFooter);
        return card;
    }

    private buildCard(...children: (Node | string)[]): HTMLDivElement
    {
        const card = document.createElement("div");
        card.className = removePrefix(Tags.PROJECT_CARD_CLASSNAME);
        card.dataset.language = children.length > 0 ? (children[0] as HTMLElement).dataset.language : "";

        card.append(...children);
        return card;
    }

    private buildHeader(project: Project): HTMLDivElement
    {
        const cardHeading = document.createElement("div");
        cardHeading.className = removePrefix(Tags.PROJECT_CARD_HEADING);
        cardHeading.dataset.language = project.language;

        const h2 = document.createElement("h2");
        h2.textContent = project.name;
        cardHeading.append(h2);
        return cardHeading;
    }

    private buildContent(project: Project): HTMLDivElement
    {
        const cardContent = document.createElement("div");
        const isEnglish = document.documentElement.lang === "en";
        cardContent.className = removePrefix(Tags.PROJECT_CARD_DETAILS);

        const projectMeta = document.createElement("div");
        projectMeta.className = "project-language";

        const programmingLanguage = document.createElement("img");
        programmingLanguage.src = `${project.languageIconUrl}`;
        programmingLanguage.alt = "";
        programmingLanguage.loading = "lazy";
        programmingLanguage.decoding = "async";

        projectMeta.append(programmingLanguage, project.language);

        const projectTags = document.createElement("div");
        projectTags.className = "project-tags";
        project.tags.forEach(tag =>
        {
            const tagElement = document.createElement("span");
            tagElement.className = "project-tag";
            tagElement.textContent = tag;
            projectTags.appendChild(tagElement);
        });

        const description = document.createElement("p");
        description.textContent = project.description === "No description available."
            ? (isEnglish ? project.description : "Keine Beschreibung verfügbar.")
            : project.description;
        cardContent.append(projectMeta, projectTags, description);
        return cardContent;
    }

    private buildFooter(project: Project): HTMLDivElement
    {
        const cardFooter = document.createElement("div");
        cardFooter.className = removePrefix(Tags.PROJECT_CARD_FOOTER);

        const url = document.createElement("a");
        url.href = project.url;
        url.target = "_blank";
        url.rel = "noopener noreferrer";
        const isEnglish = document.documentElement.lang === "en";
        const repositoryLabel = isEnglish ? "View repository" : "Repository ansehen";
        url.setAttribute("aria-label", `${project.name} ${repositoryLabel}`);

        const linkLabel = document.createElement("span");
        linkLabel.textContent = repositoryLabel;

        const versionControlImg = document.createElement("img");
        versionControlImg.src = `${project.versionControl}`;
        versionControlImg.alt = "";
        versionControlImg.width = 40;
        versionControlImg.height = 40;
        versionControlImg.loading = "lazy";
        versionControlImg.decoding = "async";
        url.append(versionControlImg, linkLabel);

        cardFooter.append(url);
        return cardFooter;
    }
}

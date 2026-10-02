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

        const card: HTMLElement = this.buildCard(project, cardHeading, cardContent, cardFooter);
        return card;
    }

    private buildCard(project: Project, ...children: (Node | string)[]): HTMLElement
    {
        const card = document.createElement("article");
        card.className = removePrefix(Tags.PROJECT_CARD_CLASSNAME);
        card.dataset.language = project.language;

        card.append(...children);
        return card;
    }

    private buildHeader(project: Project): HTMLDivElement
    {
        const cardHeading = document.createElement("div");
        cardHeading.className = removePrefix(Tags.PROJECT_CARD_HEADING);

        const projectMeta = document.createElement("div");
        projectMeta.className = "project-language";

        const programmingLanguage = document.createElement("img");
        programmingLanguage.src = `${project.languageIconUrl}`;
        programmingLanguage.alt = "";
        programmingLanguage.loading = "lazy";
        programmingLanguage.decoding = "async";

        projectMeta.append(programmingLanguage, project.language);

        const h2 = document.createElement("h2");
        h2.textContent = project.name;
        h2.title = project.name;

        cardHeading.append(projectMeta, h2);
        return cardHeading;
    }

    private buildContent(project: Project): HTMLDivElement
    {
        const cardContent = document.createElement("div");
        const isEnglish = document.documentElement.lang === "en";
        cardContent.className = removePrefix(Tags.PROJECT_CARD_DETAILS);

        const description = document.createElement("p");
        description.textContent = project.description === "No description available."
            ? (isEnglish ? project.description : "Keine Beschreibung verfügbar.")
            : project.description;
        cardContent.append(description);

        if (project.tags.length > 0)
        {
            const projectTags = document.createElement("ul");
            projectTags.className = "project-tags";
            project.tags.forEach(tag =>
            {
                const tagElement = document.createElement("li");
                tagElement.className = "project-tag";
                tagElement.textContent = tag;
                projectTags.appendChild(tagElement);
            });
            cardContent.append(projectTags);
        }

        return cardContent;
    }

    private buildFooter(project: Project): HTMLDivElement
    {
        const cardFooter = document.createElement("div");
        cardFooter.className = removePrefix(Tags.PROJECT_CARD_FOOTER);

        const url = document.createElement("a");
        url.className = "project-link";
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
        versionControlImg.width = 28;
        versionControlImg.height = 28;
        versionControlImg.loading = "lazy";
        versionControlImg.decoding = "async";

        const arrow = document.createElement("span");
        arrow.className = "project-link-arrow";
        arrow.setAttribute("aria-hidden", "true");
        arrow.textContent = "→";

        url.append(versionControlImg, linkLabel, arrow);

        cardFooter.append(url);
        return cardFooter;
    }
}

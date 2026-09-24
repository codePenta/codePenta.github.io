// updateProjects.js
import { writeFileSync } from "node:fs";
import { fetchPublicRepos } from "./lib/github.js";
import { mapProject } from "./lib/mapProject.js";
import { translate } from "./lib/translate.js";

const PROJECTS_OUTPUT = new URL("../public/data/projects.json", import.meta.url);
const I18N_OUTPUT = new URL("../public/data/projects.i18n.json", import.meta.url);

const token = process.env.REPOSITORY_FETCH_TOKEN;
const deeplKey = process.env.DEEPL_API_TOKEN;

if (!token) throw new Error("REPOSITORY_FETCH_TOKEN is not set");
if (!deeplKey) throw new Error("DEEPL_API_KEY is not set");

const repos = await fetchPublicRepos(token);
const projects = repos.map(mapProject);

writeFileSync(PROJECTS_OUTPUT, JSON.stringify(projects, null, 2));
console.log(`Wrote ${projects.length} projects to projects.json`);

const i18nMap = {};

for (const project of projects)
{
    if (!project.description) continue;

    const de = await translate(project.description, "DE", deeplKey);

    i18nMap[project.name] = {
        en: project.description,
        de,
    };

    console.log(`Translated: ${project.name}`);
}

writeFileSync(I18N_OUTPUT, JSON.stringify(i18nMap, null, 2));
console.log(`Wrote projects.i18n.json`);
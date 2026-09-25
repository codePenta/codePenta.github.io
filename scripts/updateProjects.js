// updateProjects.js
import { writeFileSync } from "node:fs";
import { fetchPublicRepos } from "./lib/github.js";
import { mapProject } from "./lib/mapProject.js";
import { translateBoth } from "./lib/translate.js";
import { loadCache, saveCache } from "./lib/translationCache.js";

const PROJECTS_OUTPUT = new URL("../public/data/projects.json", import.meta.url);
const I18N_OUTPUT = new URL("../public/data/projects.i18n.json", import.meta.url);

const token = process.env.REPOSITORY_FETCH_TOKEN;
const deeplKey = process.env.DEEPL_API_KEY;

if (!token) throw new Error("REPOSITORY_FETCH_TOKEN is not set");
if (!deeplKey) throw new Error("DEEPL_API_KEY is not set");

const repos = await fetchPublicRepos(token);
const projects = repos.map(mapProject);

writeFileSync(PROJECTS_OUTPUT, JSON.stringify(projects, null, 2));
console.log(`Wrote ${projects.length} projects to projects.json`);

const oldCache = loadCache();
const newCache = {};
const i18nMap = {};

for (const project of projects)
{
    if (!project.description) continue;

    const cached = oldCache[project.name];

    if (cached && cached.sourceText === project.description)
    {
        i18nMap[project.name] = { en: cached.en, de: cached.de };
        newCache[project.name] = cached;
        console.log(`Unverändert, übersprungen: ${project.name}`);
        continue;
    }

    try
    {
        const { en, de } = await translateBoth(project.description, deeplKey);
        i18nMap[project.name] = { en, de };
        newCache[project.name] = { sourceText: project.description, en, de };
        console.log(`Übersetzt: ${project.name}`);
    }
    catch (error)
    {
        console.error(`Translation failed for ${project.name}: ${error.message}`);

        if (cached)
        {
            i18nMap[project.name] = { en: cached.en, de: cached.de };
            newCache[project.name] = cached;
            console.warn(`Using deprecated cache entry for ${project.name}`);
        }
    }
}

writeFileSync(I18N_OUTPUT, JSON.stringify(i18nMap, null, 2));
saveCache(newCache);
console.log(`Wrote projects.i18n.json`);
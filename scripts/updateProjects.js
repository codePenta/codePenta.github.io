import { writeFileSync } from "node:fs";
import { fetchPublicRepos } from "./lib/github.js";
import { mapProject } from "./lib/mapProject.js";

const OUTPUT_FILE = new URL("../public/data/projects.json", import.meta.url);

const token = process.env.REPOSITORY_FETCH_TOKEN;
if (!token)
    throw new Error("REPOSITORY_FETCH_TOKEN is not set");

const repos = await fetchPublicRepos(token);
const projects = repos.map(mapProject);

writeFileSync(OUTPUT_FILE, JSON.stringify(projects, null, 2));
console.log(`Wrote ${projects.length} projects`);
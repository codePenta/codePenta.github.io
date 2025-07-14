import fs, { write } from 'fs'
import dotenv from 'dotenv'
import path from 'path'; // Neues Modul für Pfade
import { fileURLToPath } from 'url'; // Für ES Modules in Node.js

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.resolve(__dirname, '../public/data/projects.json');

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const username = process.env.VITE_GITHUB_USERNAME;
const apiUrlTemplate = process.env.API_URL_TEMPLATE;

if (!username) throw new Error("VITE_GITHUB_USERNAME is not set!");
if (!apiUrlTemplate) throw new Error("API_URL is not set!");

const apiUrl = apiUrlTemplate.replace("{username}", username);

function fulfillConditionsForJSONFile(outputDir)
{
    if (!fs.existsSync(outputDir))
    {
        fs.mkdirSync(outputDir, { recursive: true }); // Erstellt den Ordner, auch wenn Zwischenordner fehlen
    }
}

function writeToJsonFile(projects)
{
    const outputDir = path.dirname(outputPath);

    try
    {
        fulfillConditionsForJSONFile(outputDir);
        fs.writeFileSync(outputPath, JSON.stringify(projects, null, 2));
    } catch (error)
    {
        console.error(error);
    }
}

fetch(apiUrl)
    .then(res => res.json())
    .then(repos =>
    {
        if (!Array.isArray(repos))
        {
            throw new Error("GitHub API did not return an array. Response: " + JSON.stringify(repos));
        }
        const projects = repos.map(repo => ({
            name: repo.name,
            description: repo.description ?? "No description given",
            url: repo.html_url,
            image: repo.owner.avatar_url,
            tags: repo.topics || []
        }));

        writeToJsonFile(projects);
    })
    .catch(err =>
    {
        console.error("Fetch error:", err);
        process.exit(1);
    });
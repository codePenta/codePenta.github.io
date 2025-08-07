import fs, { write } from 'fs'
import dotenv from 'dotenv'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.resolve(__dirname, '../public/data/projects.json');

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const apiUrl = "https://api.github.com/user/repos"
const repositoryFetchToken = process.env.REPOSITORY_FETCH_TOKEN;

if (!repositoryFetchToken) throw new Error("REPOSITORY_FETCHING_TOKEN is not set!");

function fulfillConditionsForJSONFile(outputDir)
{
    if (!fs.existsSync(outputDir))
    {
        fs.mkdirSync(outputDir, { recursive: true });
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

fetch(apiUrl, {
    headers:
    {
        'Authorization': `token ${repositoryFetchToken}`
    }
})
    .then(res => res.json())
    .then(repos =>
    {
        if (!Array.isArray(repos))
        {
            throw new Error("GitHub API did not return an array. Response: " + JSON.stringify(repos, null, 2));
        }
        const projects = repos.map(repo => ({
            name: repo.name,
            description: repo.description,
            language: repo.language,
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
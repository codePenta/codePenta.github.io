import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()

const username = process.env.VITE_GITHUB_USERNAME;
const apiUrlTemplate = process.env.API_URL;

if (!username) throw new Error("VITE_GITHUB_USERNAME is not set!");
if (!apiUrlTemplate) throw new Error("API_URL is not set!");

const apiUrl = apiUrlTemplate.replace("{username}", username);

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
            description: repo.description ?? "Not description given",
            url: repo.html_url,
            image: repo.owner.avatar_url,
            tags: repo.topics || []
        }));

        fs.writeFileSync('dist/data/projects.json', JSON.stringify(projects, null, 2));
    })
    .catch(err =>
    {
        console.error("Fetch error:", err);
        process.exit(1);
    });
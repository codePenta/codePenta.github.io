import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()

const username = process.env.VITE_GITHUB_USERNAME
const apiUrl = process.env.API_URL.replace("{username}", username);

fetch(apiUrl)
    .then(res => res.json())
    .then(repos =>
    {
        const projects = repos.map(repo => ({
            name: repo.name,
            description: repo.description ?? "Not description given",
            url: repo.html_url,
            image: repo.owner.avatar_url,
            tags: repo.topics || []
        }))

        fs.writeFileSync('data/projects.json', JSON.stringify(projects, null, 2));
    })
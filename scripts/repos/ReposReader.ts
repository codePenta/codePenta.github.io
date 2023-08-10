import { Octokit } from "octokit";
import Repo from "./Repo";

export default class ReposReader {

    private results: Repo[] = [];

    constructor() {
    }

    async getData() {
        try {
            const octokit = new Octokit({ auth: process.env.PERSONAL_ACCESS_TOKEN });

            return await octokit.rest.repos.listForAuthenticatedUser();

        } catch (error: any) {
            console.error(error)
        }
    }

    parseData(reposListRaw: Promise<any>) {
        reposListRaw.then((reposList) => {
            reposList.data.forEach((repo: any) => {
                const newRepo = new Repo(repo.name, repo.html_url, repo.description, repo.language);
                this.results.push(newRepo);
            });
        });
    }

    getResults() {
        return this.results;
    }
}
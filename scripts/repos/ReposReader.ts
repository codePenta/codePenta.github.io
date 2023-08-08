import { Octokit } from "octokit";
import Repo from "./Repo";

export default class ReposReader {

    public results: Repo[] = [];

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
        console.log("Parsing repos...");
        reposListRaw.then((reposList) => {
            console.log("Repos parsed!");
            reposList.data.forEach((repo: any) => {
                console.log(repo);
                const newRepo = new Repo(repo.name, repo.html_url, repo.description, repo.language);
                this.results.push(newRepo);
            });
        });
    }
}
import { Octokit } from "octokit";
import Repo from "./Repo";

export default class ReposReader {

    private results: Repo[] = [];

    constructor() {
        this.parseData(this.getData());

        console.log(this.results);
        
    }

    private async getData() {
        if (!process.env.PERSONAL_ACCESS_TOKEN) throw new Error("No personal access token provided");

        try {
            const cacheKey = "reposListCache";
            const cachedData = localStorage.getItem(cacheKey);

            if (cachedData) {
                console.log("Cached data found");
                const octokit = new Octokit({ auth: process.env.PERSONAL_ACCESS_TOKEN });

                console.log("Checking if cached data is still valid");
                const response = await octokit.request("GET /user/repos", {
                    headers: {
                        "If-None-Match": cachedData,
                    },
                });

                console.log("Response status: " + response.status);

                if (Number(response.status) === 304) {
                    console.log("Using cached data");
                    return JSON.parse(localStorage.getItem(cacheKey)!);
                } else {
                    console.log("Fetching new data");
                    const newData = response.data;
                    localStorage.setItem(cacheKey, response.headers.etag!);
                    return newData;
                }
            } else {
                // If there is no cached data, fetch the data and cache it
                console.log("No cached data found");
                const octokit = new Octokit({ auth: process.env.PERSONAL_ACCESS_TOKEN });
                const response = await octokit.request("GET /user/repos");
                const data = response.data;
                localStorage.setItem(cacheKey, response.headers.etag!);
                return data;
            }
        } catch (error: any) {
            console.error(error);
        }
    }

    private parseData(reposListRaw: Promise<any>) {
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
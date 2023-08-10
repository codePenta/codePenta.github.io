import { Octokit } from "octokit";
import Repo from "./Repo";

export default class ReposReader {

    private results: Repo[] = [];

    constructor() {
        this.parseData(this.getData());
    }

    private async getData() {
        if (!process.env.PERSONAL_ACCESS_TOKEN) throw new Error("No personal access token provided");
      
        try {
          const cacheKey = "reposListCache";
          const cachedData = localStorage.getItem(cacheKey);
          const octokit = new Octokit({ auth: process.env.PERSONAL_ACCESS_TOKEN });
      
          if (cachedData) {
            const { timestamp, data } = JSON.parse(cachedData);
            const now = new Date().getTime();
            const tenMinutes = 10 * 60 * 1000; // 1 hour in milliseconds
      
            if (now - timestamp < tenMinutes) {
              console.log("Using cached data");
              return data;
            }
          }
      
          console.log("Fetching data from API");
          const data = await octokit.request("GET /user/repos");
          localStorage.setItem(cacheKey, JSON.stringify({ timestamp: new Date().getTime(), data }));
          return data;
      
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
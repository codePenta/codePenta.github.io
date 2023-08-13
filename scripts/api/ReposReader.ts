import { Octokit } from "octokit";
import Repo from "../entities/Repo";

export default class Reader {

  results: Repo[] = [];

  constructor() {
    this.parseData(this.getData());

  }

  private async getData() {
    if (!process.env.PERSONAL_ACCESS_TOKEN) throw new Error("No personal access token provided");

    try {
      const cacheKey = "reposListCache";
      const cachedData = localStorage.getItem(cacheKey);
      const octokit = new Octokit({ auth: process.env.PERSONAL_ACCESS_TOKEN });

      let headers = {};

      if (cachedData) {
        const { lastModified } = JSON.parse(cachedData);
        headers = { "If-Modified-Since": lastModified };
      }

      console.log("Fetching data from API");
      const response = await octokit.request("GET /user/repos", headers);

      if (Number(response.status) === 304) {
        console.log("Using cached data");
        return JSON.parse(cachedData).data;
      }

      const lastModified = response.headers["last-modified"];
      const data = response.data;

      localStorage.setItem(cacheKey, JSON.stringify({ lastModified, data }));
      return data;

    } catch (error: any) {
      console.error(error);
    }
  }

  private parseData(reposListRaw: Promise<any>) {
    reposListRaw.then((reposList) => {
      reposList.forEach((repo: any) => {
        const newRepo = new Repo(repo.name, repo.url, repo.description, repo.language);
        this.results.push(newRepo);
      });
    });
  }

  getResults() {
    return this.results;
  }
}
import { Octokit } from "octokit";
import Repo from "../entities/Repo";

export default class Reader {

  results: Repo[] = [];

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

      const response = await octokit.request("GET /user/repos", headers);

      if (Number(response.status) === 304) {
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

  async getResults() {
    const data = await this.getData();

    data.forEach((repo: any) => {
      this.results.push(new Repo(repo.name, repo.url, repo.description, repo.language));
    });
  }
}
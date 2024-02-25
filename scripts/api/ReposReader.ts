import { Octokit } from "@octokit/core";

export default class Reader {

  async getData() {
    try {
      const cacheKey = "reposListCache";
      const cachedData = localStorage.getItem(cacheKey);
      const octokit = new Octokit({ auth: process.env.PERSONAL_ACCESS_TOKEN });

      let headers = {};

      if (cachedData) {
        const { lastModified } = JSON.parse(cachedData);
        headers = {
          "If-Modified-Since": lastModified,
          "X-GitHub-Api-Version": "2022-11-28"
        };
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
}
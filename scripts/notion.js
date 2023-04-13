const { Client } = require("@notionhq/client");

class NotionProjects {
  constructor(databaseId, notionToken) {
    this.databaseId = databaseId;
    this.notion = new Client({ auth: notionToken });
  }

  async getCurrentProject() {
    try {
      const currentProject = await this.notion.databases.query({
        database_id: this.databaseId,
        filter: {
          property: "Status",
          select: {
            equals: "In progress",
          },
        },
      });
      return currentProject.results[0].properties.Name.title[0].plain_text;
    } catch (error) {
      console.log(error.body);
      // or throw error; to re-throw the error to the caller
    }
  }
}

module.exports = NotionProjects;


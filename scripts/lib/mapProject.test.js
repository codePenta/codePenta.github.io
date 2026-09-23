// scripts/lib/mapProject.test.js
import { test } from "node:test";
import assert from "node:assert/strict";
import { mapProject } from "./mapProject.js";

test("maps a GitHub repo to a project", () =>
{
    const repo = { name: "demo", description: null, language: "C#", html_url: "https://github.com/u/demo", owner: { avatar_url: "a.png" } };
    assert.deepEqual(mapProject(repo), { name: "demo", description: null, language: "C#", url: "https://github.com/u/demo", image: "a.png", tags: [] });
});
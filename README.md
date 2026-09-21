# codePenta.github.io

This project is a small portfolio / project showcase website for GitHub projects. It fetches project metadata, maps it to a local app model, and renders navigation and project cards.

## Quick start

```bash
npm install
npm run dev
```

## Project goals

- Show project cards in a simple portfolio layout
- Aggregate GitHub metadata from local JSON data
- Filter projects by language
- Keep the UI lightweight and static

## Structure overview

```text
.
├── documentation/            # Mermaid diagrams and architecture docs
├── public/                   # Public static assets and generated data files
│   └── data/
├── scripts/                  # Fetchers and data generation scripts
│   ├── fetchers/
│   ├── generators/
│   └── processors/
├── src/                      # Application source code
│   ├── api/
│   ├── components/
│   ├── data/
│   ├── services/
│   ├── styles/
│   ├── utils/
│   ├── index.ts
│   └── store.ts
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## Main flow

1. The app initializes in [src/index.ts](src/index.ts)
2. It fetches project data through [src/api/github/services/projectsAPI.ts](src/api/github/services/projectsAPI.ts)
3. The fetched data is mapped and stored in [src/store.ts](src/store.ts)
4. UI components render the cards and navbar using the app state

## Main pain points in the current structure

The project is functional, but a few things make it harder to read than necessary:

- Data is spread across multiple sources and generated files
- Some logic is mixed between app runtime code and build scripts
- Generic folders such as `utils`, `data`, and `services` are broad and not sharply separated
- The project lacks a single place describing architecture and responsibilities

## Step-by-step cleanup plan

### Step 1: document the architecture
This is the current first step. The project now has a single place explaining the intended structure and the current pain points.

### Step 2: define a single source of truth for project data
The project should decide whether generated JSON or source JSON is canonical. Avoid duplicate responsibilities.

### Step 3: reorganize by feature area
Group logic by feature instead of by generic folder names where possible.

### Step 4: reduce cross-layer coupling
Keep API/data mapping separate from UI rendering logic.

### Step 5: add project quality checks
Add linting and formatting standards to keep the codebase stable and easier to understand.

## Notes

This README is intentionally kept simple and actionable. The goal is not to rewrite the app immediately, but to make the structure understandable again before making bigger refactors.

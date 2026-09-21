# Project architecture and cleanup plan

## Current state

This project is a lightweight portfolio page composed of:

- a homepage shell
- a project list UI
- project filtering
- GitHub data mapping
- static assets and generated data files

The codebase is already usable, but it mixes responsibilities across different folders. That is the main reason it feels hard to follow.

## Observed structure

### Runtime app code

- [src/index.ts](../src/index.ts) initializes the application
- [src/store.ts](../src/store.ts) stores app state
- [src/components](../src/components) contains visual UI pieces
- [src/services](../src/services) contains icon and UI-related helpers
- [src/api](../src/api) contains API/entity/mapping layers

### Data and generation pipeline

- [public/data/projects.json](../public/data/projects.json) is a public dataset used by the app
- [scripts/generators](../scripts/generators) creates or transforms data files
- [scripts/fetchers](../scripts/fetchers) fetches remote project metadata
- [scripts/processors](../scripts/processors) handles mapping/processing

### Documentation

- [documentation](.) contains Mermaid diagrams for architecture and flow

## Main problems

### 1. Two layers of data responsibility

The project currently has data that is both:

- runtime consumed by the app through public JSON
- generated or transformed by scripts in the build pipeline

This makes it unclear which file is the authoritative source.

### 2. Generic folder names are broad

Folders such as `src/services`, `src/utils`, and `src/data` are useful, but they do not clearly signal the feature boundaries of the app.

### 3. Documented architecture is missing

There is no single document describing what belongs where, which makes maintenance slower over time.

## Target structure

A clearer structure would look similar to this:

```text
src/
├── app/
│   ├── boot/
│   ├── state/
│   └── routes/
├── features/
│   ├── projects/
│   ├── navigation/
│   └── icons/
├── shared/
│   ├── api/
│   ├── utils/
│   └── constants/
├── styles/
└── index.ts
```

This keeps business logic, UI, and shared utilities distinct and easier to read.

## Recommended refactor sequence

### Step 1: document the actual architecture
This is already being captured in the project documentation and README.

### Step 2: choose a single source of truth for project data
Pick one canonical data source and treat the rest as generated output.

### Step 3: separate runtime app code from generation scripts
Build scripts should not live in the same conceptual layer as application logic.

### Step 4: group by feature
Move project-related logic under a project feature folder instead of leaving it spread across generic folders.

### Step 5: add linting and formatting
This makes future restructurings safer and keeps the code consistent.

## Practical next move

The next clean step is to create a single source-of-truth policy and reduce the amount of duplicated project-data handling. After that, the folder layout should be simplified without changing behavior.

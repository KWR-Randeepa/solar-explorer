# Solar Explorer – Interactive Solar System Learning Platform

Solar Explorer is an educational website that helps students explore the eight planets, learn facts about them, observe simplified orbital motion in 3D, and take a short knowledge quiz.

## Current features

- Interactive 3D solar system built with Three.js
- Select planets by clicking the 3D model, planet number, or planet card
- Rotate and zoom the scene
- Pause/resume orbits and adjust animation speed
- Planet profiles with distance, diameter, year length and moon count
- Five-question quiz with instant feedback and score
- Responsive layout for desktop, tablet and mobile

## Technology

- HTML, CSS and JavaScript
- Three.js for 3D graphics
- GitHub for source control
- Azure Static Web Apps for hosting (deployment phase)

## Run locally

Because the 3D scene uses JavaScript modules, run the site through a local web server rather than opening `index.html` directly.

### Option A: VS Code Live Server

1. Open this folder in Visual Studio Code.
2. Install the **Live Server** extension.
3. Right-click `index.html`.
4. Select **Open with Live Server**.

### Option B: Python local server

If Python is installed, open a terminal in this folder and run:

```bash
python -m http.server 5500
```

Then open `http://localhost:5500`.

## Project structure

```text
solar-explorer/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
├── docs/
├── staticwebapp.config.json
└── README.md
```

## Azure deployment plan

1. Push this repository to GitHub.
2. Create an Azure Static Web App and connect the GitHub repository.
3. Select the `main` branch.
4. Use `/` as the app location and leave API and output locations empty.
5. Let Azure create the GitHub Actions workflow.
6. Verify the workflow succeeds and open the generated website URL.

## Planned Azure enhancements

- Azure Functions API to accept quiz submissions
- Azure Storage to store anonymous quiz scores or aggregate activity
- Application Insights for backend diagnostics and monitoring

## Learning and accuracy note

The 3D model is a simplified educational visualization. Planet sizes, distances and orbital speeds are not displayed to scale. Facts such as moon counts can change as astronomical discoveries are updated.

## Responsible use

This starter project does not collect student names, email addresses, or other personal information. Add authentication or student progress tracking only after defining appropriate privacy and safeguarding requirements.

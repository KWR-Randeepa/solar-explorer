# Azure deployment notes

## Recommended hosting

Use **Azure Static Web Apps**. This is separate from the **Static website** feature inside an Azure Storage account.

## Initial build settings

For this no-build-step HTML/CSS/JavaScript starter:

- App location: `/`
- API location: leave empty for the first deployment
- Output location: leave empty

Connect the Azure Static Web App to the GitHub repository and the `main` branch. Azure creates a GitHub Actions workflow to build and deploy the site whenever you push changes.

## Later backend phase

After the static website is live, add an Azure Functions API under an `api/` folder. Possible endpoints:

- `POST /api/quiz-result` – accept a quiz score
- `GET /api/health` – return a simple service status

For persistent data, connect the function to Azure Storage. Keep connection strings and secrets in Azure application settings, never in frontend JavaScript or committed files.

## Evidence to capture

- Azure Static Web App overview page
- GitHub Actions successful deployment
- Live website URL in a browser
- Interactive 3D model with a selected planet
- Quiz result screen
- API test response after the backend phase is complete

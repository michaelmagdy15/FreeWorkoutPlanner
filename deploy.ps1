# MITRIXO Workouts - Google Cloud Run Source Deployer
Write-Host "Preparing to redeploy MITRIXO Workouts to Google Cloud Run..." -ForegroundColor Blue

# Run gcloud deploy from current source
gcloud run deploy mitrixo-workouts `
  --source . `
  --region europe-west1 `
  --project bengarab `
  --allow-unauthenticated

if ($LASTEXITCODE -eq 0) {
    Write-Host "MITRIXO Workouts successfully redeployed live!" -ForegroundColor Green
    Write-Host "Live URL: https://mitrixo-workouts-430356395102.europe-west1.run.app" -ForegroundColor Cyan
} else {
    Write-Host "Deployment encountered an issue. Please check the logs above." -ForegroundColor Red
}

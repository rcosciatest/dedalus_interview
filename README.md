# Medical Image Viewer Tests

## Structure
- **Tests**: `tests/imaging_tests/imaging.spec.ts` - Medical viewer functionality tests
- **POM**: `common/pom/MedicalImage.page.ts` - Reusable page interactions
- **CI/CD**: `.github/workflows/playwright-tests.yml` - Automated test execution

## Test Coverage
- Image rendering & navigation
- Series switching & patient data
- Performance validation

## Quick Start
```bash
# Local execution
pnpm exec playwright test

# Specific browser
pnpm exec playwright test --project=chromium
```

## CI/CD
- **Triggers**: Manual, PR, main branch push
- **Browsers**: Chromium, Firefox
- **Environments**: staging, production, local
- **Artifacts**: Test reports, traces, screenshots (30-day retention)
  - Environment selection (staging, production, local)
  - Automatic artifact upload (reports, traces, screenshots)
  - Cross-platform execution

### Usage
```bash
# Run tests locally
pnpm exec playwright test

# Run specific browser
pnpm exec playwright test --project=chromium

# Run imaging tests only
pnpm exec playwright test tests/imaging_tests/
```

### Manual Execution
Use GitHub Actions "Run workflow" with options for browser and environment selection.

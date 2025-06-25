# Medical Image Viewer - Playwright Test Suite

Comprehensive end-to-end testing suite for the medical image viewer application using Playwright with TypeScript.

## 🎯 Test Coverage

### Core Test Features (4 Required Tests Implemented)

1. **✅ Correctness of Rendering of Images**
   - Verifies images load correctly from both series (Series 1: 7 JPEG images, Series 2: 6 JPEG images)
   - Validates image format (JPEG) and source paths
   - Uses `imagerendered` custom event for comprehensive validation

2. **✅ Navigation Between Images Using Mouse Scroll**
   - Tests mouse wheel scrolling functionality for navigating through image stacks
   - Confirms image index updates correctly during navigation
   - Verifies boundary conditions (first/last image)
   - Validates correct images are loaded after navigation

3. **✅ Switch of Series**
   - Tests switching between Series 1 (7 JPEG images) and Series 2 (6 JPEG images)
   - Validates that image index resets to 1 when switching series
   - Confirms current series information updates in the left panel
   - Verifies correct images are loaded for each series
   - Tests series highlighting (blue selection) updates correctly

4. **✅ Verify Patient Information Overlay Displays Correct Data**
   - Validates patient name and ID are correctly displayed in bottom-left overlay
   - Tests that patient information persists across series switches
   - Verifies overlay positioning and visibility

### Additional Features

5. **✅ Performance and Visual Validation**
   - Image loading performance metrics
   - Navigation responsiveness testing
   - Visual regression testing with screenshots
   - Rendering performance validation

## 🛠️ Technical Implementation

### Framework & Best Practices
- **Framework**: Playwright with TypeScript
- **Test Organization**: Page Object Model patterns
- **Event Handling**: Custom `imagerendered` event integration
- **Assertions**: Comprehensive visual and functional validations
- **Cross-browser**: Tests run on Chromium and Firefox
- **Reporting**: Detailed HTML test reports with artifacts

### Key Features
- **Custom Event Integration**: Leverages the `imagerendered` event for precise validation
- **Performance Monitoring**: Tracks image loading and navigation performance
- **Visual Regression**: Screenshot comparison for UI consistency
- **Robust Waiting**: Smart waiting strategies for dynamic content
- **Error Handling**: Comprehensive error scenarios and boundary testing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd dedalus_playwright

# Install dependencies
pnpm install

# Install Playwright browsers
pnpm run test:install
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests with browser UI
pnpm run test:headed

# Run only imaging tests
pnpm run test:imaging

# Run tests in specific browser
pnpm run test:chromium
pnpm run test:firefox
pnpm run test:webkit

# Debug mode
pnpm run test:debug

# Interactive UI mode
pnpm run test:ui

# View test report
pnpm run test:report
```

## 📊 CI/CD Pipeline

### GitHub Actions Workflow

The project includes a comprehensive CI/CD pipeline (`.github/workflows/playwright-tests.yml`) that:

- **Manual Triggers**: Execute tests on demand with browser/suite selection
- **Pull Request Automation**: Run full test suite on PRs
- **Multi-browser Testing**: Parallel execution on Chromium and Firefox
- **Artifact Management**: Store test reports and results
- **Performance Monitoring**: Track and report performance metrics
- **PR Comments**: Automatic test result summaries

### Pipeline Features

```yaml
# Manual execution with options
workflow_dispatch:
  inputs:
    browser: [all, chromium, firefox, webkit]
    test_suite: [all, imaging]

# Automatic triggers
pull_request: [main, master, develop]
push: [main, master]
```

### Artifacts Generated
- HTML test reports
- Screenshots for visual regression
- Performance metrics
- Test traces for debugging

## 🧪 Test Architecture

### Test Structure

```
tests/
└── imaging_tests/
    └── imaging.spec.ts    # Main test suite
```

### Key Components

1. **Helper Functions**
   ```typescript
   // Wait for imagerendered custom event
   async function waitForImageRendered(expectedSeries?, expectedIndex?)
   ```

2. **Event Integration**
   ```typescript
   // Listen to custom events from medical-image-viewport
   viewport.addEventListener('imagerendered', (event) => {
     // Validate event.detail properties
   });
   ```

3. **Performance Tracking**
   ```typescript
   // Monitor loading times and navigation performance
   const loadTime = Date.now() - startTime;
   expect(loadTime).toBeLessThan(3000);
   ```

### Test Data

- **Series 1**: 7 JPEG images in `/public/1/` directory
- **Series 2**: 6 JPEG images in `/public/2/` directory
- **Patient Info**: John Doe (P001234567)

## 📋 Test Scenarios

### Image Rendering Tests
- ✅ JPEG format validation
- ✅ Image source path verification
- ✅ Visibility and loading confirmation
- ✅ Series-specific image counts

### Navigation Tests
- ✅ Mouse wheel scroll up/down
- ✅ Image index progression
- ✅ Boundary condition handling
- ✅ Slice information updates

### Series Switching Tests
- ✅ Index reset on series change
- ✅ UI highlighting updates
- ✅ Correct image loading per series
- ✅ Panel information updates

### Patient Information Tests
- ✅ Overlay visibility and positioning
- ✅ Data persistence across navigation
- ✅ Series switch data retention
- ✅ Bottom-left positioning validation

### Performance Tests
- ✅ Image loading time validation (< 3 seconds)
- ✅ Navigation responsiveness (< 5 seconds)
- ✅ Event delay monitoring
- ✅ Visual regression detection

## 🔧 Configuration

### Playwright Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: 'https://diit-playwright-qa-test.vercel.app/',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

### Environment Variables

- `CI`: Enables CI-specific configurations
- Custom timeouts and retry logic for different environments

## 📈 Reporting

### HTML Reports
- Detailed test execution results
- Screenshots and videos on failures
- Performance metrics visualization
- Cross-browser comparison

### Artifacts
- Test traces for debugging
- Visual regression screenshots
- Performance timing data
- Error logs and stack traces

## 🐛 Debugging

### Debug Mode
```bash
# Step-through debugging
pnpm run test:debug

# Interactive UI
pnpm run test:ui

# Headed mode (visible browser)
pnpm run test:headed
```

### Trace Analysis
- Automatic trace generation on failures
- Step-by-step action replay
- Network request monitoring
- Console log capture

## 🤝 Contributing

### Test Development Guidelines

1. **Follow Playwright Best Practices**
   - Use data-testid selectors
   - Implement proper waiting strategies
   - Add comprehensive assertions

2. **Event-Driven Testing**
   - Leverage `imagerendered` custom events
   - Validate event data thoroughly
   - Handle async operations properly

3. **Performance Considerations**
   - Monitor loading times
   - Test navigation responsiveness
   - Implement visual regression checks

4. **Cross-Browser Compatibility**
   - Test on multiple browsers
   - Handle browser-specific behaviors
   - Ensure consistent user experience

### Code Organization
- Keep tests focused and atomic
- Use descriptive test names
- Implement reusable helper functions
- Document complex test scenarios

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Medical Image Viewer API](https://diit-playwright-qa-test.vercel.app/)

## 🏷️ Version History

- **v1.0.0**: Initial comprehensive test suite implementation
  - Core 4 test features implemented
  - CI/CD pipeline configured
  - Performance and visual regression testing
  - Cross-browser support

---

**Note**: This test suite is designed to validate the medical image viewer's core functionality, ensuring reliable performance across different browsers and scenarios. The implementation follows industry best practices for E2E testing with Playwright.
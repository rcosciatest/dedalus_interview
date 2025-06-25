import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test.describe('Medical Image Viewer Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Handle welcome dialog if present
    const welcomeDialog = page.getByTestId('welcome-popup-overlay');
    if (await welcomeDialog.isVisible()) {
      await page.getByTestId('welcome-popup-accept-button').click();
    }
    
    // Wait for initial load
    await page.waitForLoadState('networkidle');
  });



  test('Correctness of Rendering of Images', async ({ page }) => {

    
    
    // Ensure viewport is present
    await expect(page.getByTestId('medical-image-viewport')).toBeVisible();
    
    // Test Series 1 first (default series)
    await expect(page.getByTestId('medical-image')).toBeVisible();
    
    // Verify medical image is visible and has correct source
    const imageElement = page.getByTestId('medical-image');
    await expect(imageElement).toBeVisible();
    
    const imageSrcOne = await imageElement.getAttribute('src');
    expect(imageSrcOne).toMatch(/\.jpeg$/);
    expect(imageSrcOne).toContain('/1/');
    
    // Verify slice information for Series 1
    await expect(page.getByTestId('slice-information')).toHaveText('1 / 7');
    
    // Test Series 2 (6 JPEG images)
    await page.getByTestId('series-2-button').click();
    await expect(page.getByTestId('slice-information')).toHaveText('1 / 6');
    
    // Verify image is visible and has correct format
    await expect(page.getByTestId('medical-image')).toBeVisible();
    const imageSrcTwo = await page.getByTestId('medical-image').getAttribute('src');
    expect(imageSrcTwo).toMatch(/\.jpeg$/);
    expect(imageSrcTwo).toContain('/2/');
  });

  test('Navigation Between Images Using Mouse Scroll', async ({ page }) => {
    // Ensure we're on Series 1
    await page.getByTestId('series-1-button').click();
    // Get initial slice information
    await expect(page.getByTestId('slice-information')).toHaveText('1 / 7');
    
    // Scroll down to next image
    await page.getByTestId('medical-image-viewport').hover();
    await page.mouse.wheel(0, 100);
    
    // Verify navigation to image 2
    await expect(page.getByTestId('slice-information')).toHaveText('2 / 7');
    
    // Scroll down multiple times
    await page.mouse.wheel(0, 100);
    await expect(page.getByTestId('slice-information')).toHaveText('3 / 7');
    await page.mouse.wheel(0, 100);
    await expect(page.getByTestId('slice-information')).toHaveText('4 / 7');
    await page.mouse.wheel(0, 100);
    await expect(page.getByTestId('slice-information')).toHaveText('5 / 7');
    
    // Should be at image 5
    await expect(page.getByTestId('slice-information')).toHaveText('5 / 7');
    
    // Scroll up to previous image
    await page.mouse.wheel(0, -100);
    await expect(page.getByTestId('slice-information')).toHaveText('4 / 7');
    
    // Test boundary conditions - scroll to last image
    await page.mouse.wheel(0, 100);
    await expect(page.getByTestId('slice-information')).toHaveText('5 / 7');
    await page.mouse.wheel(0, 100);
    await expect(page.getByTestId('slice-information')).toHaveText('6 / 7');
    await page.mouse.wheel(0, 100);
    await expect(page.getByTestId('slice-information')).toHaveText('7 / 7');
    // Additional scrolls should stay at last image
    await page.mouse.wheel(0, 100);
    await page.mouse.wheel(0, 100);
    
    // Should stay at last image (7)
    await expect(page.getByTestId('slice-information')).toHaveText('7 / 7');
    
    // Scroll back to first image
    for (let i = 0; i < 10; i++) {
      await page.mouse.wheel(0, -100);
    }
    await expect(page.getByTestId('slice-information')).toHaveText('1 / 7');
    
    // Should stay at first image (1)
    await expect(page.getByTestId('slice-information')).toHaveText('1 / 7');
  });

  test('Switch of Series', async ({ page }) => {
    // Start with Series 1 (default)
    await page.getByTestId('series-1-button').click();
    await expect(page.getByTestId('slice-information')).toHaveText('1 / 7');
    
    // Verify initial state
    await expect(page.getByTestId('slice-information')).toHaveText('1 / 7');
    let imageSrc = await page.getByTestId('medical-image').getAttribute('src');
    expect(imageSrc).toContain('/1/');
    
    // Navigate to image 3 in Series 1
    const viewport = page.getByTestId('medical-image-viewport');
    await viewport.hover();
    await page.mouse.wheel(0, 100); // Image 2
    await expect(page.getByTestId('slice-information')).toHaveText('2 / 7');
    await page.mouse.wheel(0, 100); // Image 3
    await expect(page.getByTestId('slice-information')).toHaveText('3 / 7');
    // Verify we're on image 3
    
    // Switch to Series 2
    await page.getByTestId('series-2-button').click();
    await expect(page.getByTestId('slice-information')).toHaveText('1 / 6');
    
    // Verify series switch and index reset
    await expect(page.getByTestId('slice-information')).toHaveText('1 / 6'); // Should reset to 1
    
    // Verify image source changed
    imageSrc = await page.getByTestId('medical-image').getAttribute('src');
    expect(imageSrc).toContain('/2/');
    
    // Navigate to image 4 in Series 2
    await page.getByTestId('medical-image-viewport').hover();
    await page.mouse.wheel(0, 100); // Image 2
    await expect(page.getByTestId('slice-information')).toHaveText('2 / 6');
    await page.mouse.wheel(0, 100); // Image 3
    await expect(page.getByTestId('slice-information')).toHaveText('3 / 6');
    await page.mouse.wheel(0, 100); // Image 4
    await expect(page.getByTestId('slice-information')).toHaveText('4 / 6');
    
    // Switch back to Series 1
    await page.getByTestId('series-1-button').click();
    await expect(page.getByTestId('slice-information')).toHaveText('1 / 7');
    
    // Verify series switch and index reset again // Should reset to 1
    
    // Verify image source changed back
    const finalImageSrc = await page.getByTestId('medical-image').getAttribute('src');
    expect(finalImageSrc).toContain('/1/');
  });

  test('Verify Patient Information Overlay Displays Correct Data', async ({ page }) => {
    // Verify patient information is visible
    const patientOverlay = page.getByTestId('patient-information-overlay');
    await expect(patientOverlay).toBeVisible();
    
    // Check positioning (bottom-left)
    const overlayBox = await patientOverlay.boundingBox();
    expect(overlayBox).toBeTruthy();
    
    // Verify patient name and ID are displayed
    await expect(page.getByTestId('patient-name')).toBeVisible();
    await expect(page.getByTestId('patient-id')).toBeVisible();
    
    // Get the patient information text
    const patientName = await page.getByTestId('patient-name').textContent();
    const patientId = await page.getByTestId('patient-id').textContent();
    
    expect(patientName).toBeTruthy();
    expect(patientId).toBeTruthy();
    
    // Test persistence across image navigation
    const viewport = page.getByTestId('medical-image-viewport');
    await viewport.hover();
    await page.mouse.wheel(0, 100); // Navigate to next image
    await expect(page.getByTestId('slice-information')).toHaveText('2 / 7');
    
    // Patient info should persist
    await expect(page.getByTestId('patient-name')).toHaveText(patientName!);
    await expect(page.getByTestId('patient-id')).toHaveText(patientId!);
    
    // Test persistence across series switch
    await page.getByTestId('series-2-button').click();
    await expect(page.getByTestId('slice-information')).toHaveText('1 / 6');
    
    // Patient info should still be visible and correct
    await expect(patientOverlay).toBeVisible();
    await expect(page.getByTestId('patient-name')).toHaveText(patientName!);
    await expect(page.getByTestId('patient-id')).toHaveText(patientId!);
    
    // Verify overlay positioning remains consistent
    const newOverlayBox = await patientOverlay.boundingBox();
    expect(newOverlayBox).toBeTruthy();
    expect(newOverlayBox!.x).toBeCloseTo(overlayBox!.x, 10);
    expect(newOverlayBox!.y).toBeCloseTo(overlayBox!.y, 10);
  });

  test('Performance and Visual Validation', async ({ page }) => {
    // Test image loading performance
    const startTime = Date.now();
    
    await page.getByTestId('series-1-button').click();
    await expect(page.getByTestId('medical-image')).toBeVisible();
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000); // Should load within 3 seconds
    
    // Test rapid navigation performance
    const rapidNavStart = Date.now();
    const viewport = page.getByTestId('medical-image-viewport');
    await viewport.hover();
    
    // Rapidly navigate through images
    for (let i = 2; i <= 7; i++) {
      await page.mouse.wheel(0, 100);
      await expect(page.getByTestId('slice-information')).toHaveText(`${i} / 7`);
    }
    
    const rapidNavTime = Date.now() - rapidNavStart;
    expect(rapidNavTime).toBeLessThan(8000); // Should complete within 8 seconds
    
    // Verify final state
    await page.getByTestId('series-1-button').click();
    await expect(page.getByTestId('slice-information')).toHaveText('1 / 7');
    await expect(page.getByTestId('medical-image')).toBeVisible();
    
    // Performance metrics logging
    console.log(`Initial load time: ${loadTime}ms`);
    console.log(`Rapid navigation time: ${rapidNavTime}ms`);
  });
});

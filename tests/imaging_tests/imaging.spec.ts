import { test, expect } from '@playwright/test';
import { MedicalImageViewerPage } from '../../common/pom/MedicalImage.page';

test.describe.configure({ mode: 'serial' });

test.describe('Medical Image Viewer Tests', () => {
  let medicalImagePage: MedicalImageViewerPage;

  test.beforeEach(async ({ page }) => {
    medicalImagePage = new MedicalImageViewerPage(page);
    await medicalImagePage.navigate();
  });

  test('Correctness of Rendering of Images', async () => {
    await medicalImagePage.expectViewportVisible();
    await medicalImagePage.expectImageVisible();
    
    await medicalImagePage.expectImageData(1, 1);
    await medicalImagePage.expectSliceInformation('1 / 7');
    
    await medicalImagePage.selectSeries(2);
    await medicalImagePage.expectImageData(2, 1);
    await medicalImagePage.expectImageSourceFromEvent('/2/');
    await medicalImagePage.expectSliceInformation('1 / 6');
  });

  test('Navigation Between Images Using Mouse Scroll', async () => {
    await medicalImagePage.selectSeries(1);
    await medicalImagePage.expectSliceInformation('1 / 7');
    
    await medicalImagePage.scrollToNextImage();
    await medicalImagePage.expectImageData(1, 2);
    await medicalImagePage.expectSliceInformation('2 / 7');
    
    await medicalImagePage.scrollToNextImage();
    await medicalImagePage.expectImageData(1, 3);
    await medicalImagePage.expectSliceInformation('3 / 7');
    
    for (let i = 4; i <= 7; i++) {
      await medicalImagePage.scrollToNextImage();
      await medicalImagePage.expectImageData(1, i);
      await medicalImagePage.expectSliceInformation(`${i} / 7`);
    }
    
    await medicalImagePage.scrollToFirstImage();
    await medicalImagePage.expectSliceInformation('1 / 7');
  });

  test('Switch of Series', async () => {
    await medicalImagePage.navigateToSlice(3);
    await medicalImagePage.expectImageData(1, 3);
    await medicalImagePage.expectSliceInformation('3 / 7');
    
    await medicalImagePage.selectSeries(2);
    await medicalImagePage.expectImageData(2, 1);
    await medicalImagePage.expectImageSourceFromEvent('/2/');
    await medicalImagePage.expectSliceInformation('1 / 6');
    
    await medicalImagePage.scrollToNextImage();
    await medicalImagePage.expectImageData(2, 2);
    
    await medicalImagePage.selectSeries(1);
    await medicalImagePage.expectImageData(1, 1);
    await medicalImagePage.expectSliceInformation('1 / 7');
  });

  test('Verify Patient Information Overlay Displays Correct Data', async () => {
    await medicalImagePage.expectPatientInformationVisible();
    
    await medicalImagePage.expectPatientInfoFromEvent('John Doe', 'P001234567');
    
    const overlayBox = await medicalImagePage.getOverlayBoundingBox();
    expect(overlayBox).toBeTruthy();
    
    await medicalImagePage.scrollToNextImage();
    await medicalImagePage.expectSliceInformation('2 / 7');
    await medicalImagePage.expectPatientInfoFromEvent('John Doe', 'P001234567');
    
    await medicalImagePage.selectSeries(2);
    await medicalImagePage.expectSliceInformation('1 / 6');
    await medicalImagePage.expectPatientInformationVisible();
    await medicalImagePage.expectPatientInfoFromEvent('John Doe', 'P001234567');
    
    const newOverlayBox = await medicalImagePage.getOverlayBoundingBox();
    expect(newOverlayBox).toBeTruthy();
    expect(newOverlayBox!.x).toBeCloseTo(overlayBox!.x, 10);
    expect(newOverlayBox!.y).toBeCloseTo(overlayBox!.y, 10);
  });

  test('Performance and Visual Validation', async () => {
    const startTime = Date.now();
    
    await medicalImagePage.selectSeries(1);
    await medicalImagePage.expectImageVisible();
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
    
    const rapidNavStart = Date.now();
    
    for (let i = 2; i <= 7; i++) {
      await medicalImagePage.scrollToNextImage();
      await medicalImagePage.expectImageData(1, i);
      await medicalImagePage.expectSliceInformation(`${i} / 7`);
    }
    
    const rapidNavTime = Date.now() - rapidNavStart;
    expect(rapidNavTime).toBeLessThan(8000);
    
    console.log(`Initial load time: ${loadTime}ms`);
    console.log(`Rapid navigation time: ${rapidNavTime}ms`);
  });
});
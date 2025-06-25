import { test,expect, type Page } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test.describe('Imaging Feature', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext(); 
    page = await context.newPage();
    await page.goto('/');
    
    const welcomeDialog = page.getByTestId('welcome-popup-overlay');
    if (await welcomeDialog.isVisible()) {
      await page.getByTestId('welcome-popup-accept-button').click();
    }
  });

  test.afterAll(async () => {
    await page.context().close(); 
  });

  test('Correctness of Rendering of Images', async () => {
    //clicking image 2
    
    
    await page.getByTestId('series-2-button').click();
    await expect(page.getByTestId('medical-image')).toBeVisible();

    await expect(page.getByTestId('patient-name')).toContainText(/john doe/i);
    await expect(page.getByTestId('patient-id')).toContainText(/P001234567/i);
    await expect(page.getByTestId('slice-information')).toHaveText('1 / 6');
    //it should be a jpeg
    const imageSrcTwo = await page.getByTestId('medical-image').getAttribute('src');
    expect(imageSrcTwo).toMatch(/\.jpeg$/);
    
    await page.getByTestId('series-2-button').click();
    
    //click image 1
    await page.getByTestId('series-1-button').click();
    await expect(page.getByTestId('patient-name')).toContainText(/john doe/i);
    await expect(page.getByTestId('patient-id')).toContainText(/P001234567/i);
    await expect(page.getByTestId('slice-information')).toHaveText('1 / 7');
    await page.getByTestId('series-1-button').click();
    
    const imageSrcOne = await page.getByTestId('medical-image').getAttribute('src');
    expect(imageSrcOne).toMatch(/\.jpeg$/);
  });

  
  test('Navigation Between Images Using Mouse Scroll', async () => {
    //Test mouse wheel scrolling functionality for navigating through image stacks
    //Confirm image index updates correctly.
    //Verify that the correct images are loaded after the series navigation
    
  });

   
  test('Switch of Series', async () => {
    //Test switching between Series 1 (7 JPEG images) and Series 2 (6 JPEG images)
    //Validate that image index resets to 1 when switching series
    //Confirm that the current series information updates in the left panel
    //Verify that the correct images are loaded for each series
    //Test that series highlighting (blue selection) updates correctly

  });

   
  test('Verify Patient Information Overlay Displays Correct Data', async () => {
    // Validate that patient name and ID are correctly displayed in the bottom-left overlay
    //Test that patient information persists across series switches
    
  });
});

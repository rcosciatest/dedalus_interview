import { test, expect, type Page } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test.describe('Imaging Feature', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext(); 
    page = await context.newPage();
    await page.goto('/');
  });

  test.afterAll(async () => {
    await page.context().close(); 
  });

  test('Correctness of Rendering of Images', async () => {
  });

  
  test('Navigation Between Images Using Mouse Scroll', async () => {
    
  });

   
  test('Switch of Series', async () => {
    
  });

   
  test('Verify Patient Information Overlay Displays Correct Data', async () => {
    
  });
});

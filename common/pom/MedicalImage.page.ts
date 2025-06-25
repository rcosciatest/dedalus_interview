import { Page, Locator, expect } from '@playwright/test';

export class MedicalImageViewerPage {
  readonly page: Page;
  readonly viewport: Locator;
  readonly medicalImage: Locator;
  readonly sliceInformation: Locator;
  readonly series1Button: Locator;
  readonly series2Button: Locator;
  readonly patientInformationOverlay: Locator;
  readonly patientName: Locator;
  readonly patientId: Locator;
  readonly welcomeDialog: Locator;
  readonly welcomeAcceptButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.viewport = page.getByTestId('medical-image-viewport');
    this.medicalImage = page.getByTestId('medical-image');
    this.sliceInformation = page.getByTestId('slice-information');
    this.series1Button = page.getByTestId('series-1-button');
    this.series2Button = page.getByTestId('series-2-button');
    this.patientInformationOverlay = page.getByTestId('patient-information-overlay');
    this.patientName = page.getByTestId('patient-name');
    this.patientId = page.getByTestId('patient-id');
    this.welcomeDialog = page.getByTestId('welcome-popup-overlay');
    this.welcomeAcceptButton = page.getByTestId('welcome-popup-accept-button');
  }

  async navigate() {
    await this.page.goto('/');
    await this.handleWelcomeDialog();
    await this.page.waitForLoadState('networkidle');
  }

  async handleWelcomeDialog() {
    if (await this.welcomeDialog.isVisible()) {
      await this.welcomeAcceptButton.click();
    }
  }

  async selectSeries(seriesNumber: 1 | 2) {
    const button = seriesNumber === 1 ? this.series1Button : this.series2Button;
    await button.click();
  }

  async scrollToNextImage() {
    await this.viewport.hover();
    await this.page.mouse.wheel(0, 100);
  }

  async scrollToPreviousImage() {
    await this.viewport.hover();
    await this.page.mouse.wheel(0, -100);
  }

  async navigateToSlice(targetSlice: number, currentSlice: number = 1) {
    const steps = targetSlice - currentSlice;
    if (steps > 0) {
      for (let i = 0; i < steps; i++) {
        await this.scrollToNextImage();
      }
    } else if (steps < 0) {
      for (let i = 0; i < Math.abs(steps); i++) {
        await this.scrollToPreviousImage();
      }
    }
  }

  async scrollToFirstImage() {
    for (let i = 0; i < 10; i++) {
      await this.scrollToPreviousImage();
    }
  }

  async scrollToLastImage(totalSlices: number) {
    for (let i = 0; i < totalSlices; i++) {
      await this.scrollToNextImage();
    }
  }

  async getImageSource(): Promise<string | null> {
    return await this.medicalImage.getAttribute('src');
  }

  async getPatientName(): Promise<string | null> {
    return await this.patientName.textContent();
  }

  async getPatientId(): Promise<string | null> {
    return await this.patientId.textContent();
  }

  async getOverlayBoundingBox() {
    return await this.patientInformationOverlay.boundingBox();
  }

  async expectViewportVisible() {
    await expect(this.viewport).toBeVisible();
  }

  async expectImageVisible() {
    await expect(this.medicalImage).toBeVisible();
  }

  async expectSliceInformation(expected: string) {
    await expect(this.sliceInformation).toHaveText(expected);
  }

  async expectImageSourceFormat(format: RegExp) {
    const src = await this.getImageSource();
    expect(src).toMatch(format);
  }

  async expectImageSourceContains(substring: string) {
    const src = await this.getImageSource();
    expect(src).toContain(substring);
  }

  async expectPatientInformationVisible() {
    await expect(this.patientInformationOverlay).toBeVisible();
    await expect(this.patientName).toBeVisible();
    await expect(this.patientId).toBeVisible();
  }

  async expectPatientInformation(expectedName: string, expectedId: string) {
    await expect(this.patientName).toHaveText(expectedName);
    await expect(this.patientId).toHaveText(expectedId);
  }

  async expectPatientInformationContains(nameContains: string, idContains: string) {
    const patientName = await this.getPatientName();
    const patientId = await this.getPatientId();
    
    expect(patientName).toContain(nameContains);
    expect(patientId).toContain(idContains);
  }
}
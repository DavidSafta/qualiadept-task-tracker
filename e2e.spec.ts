import { test, expect } from '@playwright/test';

test('QualiAdept Task Tracker E2E Test', async ({ page }) => {
  // 1. Deschide aplicația
  await page.goto('https://qualiadept.eu');

  // 2. Localizează elementele și interacționează cu interfața

  // 3. Verifică starea cu aserțiuni web-first (expect)

});
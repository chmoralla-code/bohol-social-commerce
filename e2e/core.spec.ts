import { test, expect } from '@playwright/test';

test('homepage has correct title and hero content', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Bohol/);
  await expect(page.getByText("Elevating Bohol's Finest Creations")).toBeVisible();
});

test('can navigate to login page', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /Seller Login/i }).click();
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByRole('heading', { name: /Welcome back/i })).toBeVisible();
});

test('login form toggles between login and signup', async ({ page }) => {
  await page.goto('/login');
  
  // Initially on login
  await expect(page.getByRole('heading', { name: /Welcome back/i })).toBeVisible();
  
  // Toggle to signup
  await page.getByRole('button', { name: /Don't have an account\? Sign up/i }).click();
  await expect(page.getByRole('heading', { name: /Create seller account/i })).toBeVisible();
  
  // Toggle back to login
  await page.getByRole('button', { name: /Already have an account\? Login/i }).click();
  await expect(page.getByRole('heading', { name: /Welcome back/i })).toBeVisible();
});

test('can access email login form', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('button', { name: /Continue with Email/i }).click();
  await expect(page.getByPlaceholder('name@example.com')).toBeVisible();
  await expect(page.getByPlaceholder('••••••••')).toBeVisible();
});

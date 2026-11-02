import { test, expect } from '@playwright/test';

test('Trader can filter, paginate and see empty state on web', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.goto('/');
  await page.getByRole('button', { name: 'Thương lái', exact: true }).click();
  await page.getByRole('link', { name: 'Thị trường', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Nông dân mẫu An' })).toBeVisible();
  await page.getByLabel(/Bán kính/).fill('50');
  await page.getByRole('button', { name: 'Áp dụng bộ lọc' }).click();
  await expect(page.getByText('3 bài đăng · Trang 1', { exact: true })).toBeVisible();
  await page.screenshot({ path: '.artifacts/web-marketplace.png', fullPage: true });
  await page.getByRole('button', { name: 'Trang sau', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Nông dân mẫu Chi' })).toBeVisible();
  await page.getByLabel('Vĩ độ').fill('0');
  await page.getByLabel('Kinh độ').fill('0');
  await page.getByLabel(/Bán kính/).fill('1');
  await page.getByRole('button', { name: 'Áp dụng bộ lọc' }).click();
  await expect(
    page.getByText('Chưa có nguồn hàng trong bán kính này.', { exact: false }),
  ).toBeVisible();
  expect(pageErrors).toEqual([]);
});

test('Farmer does not get Trader feed through navigation or direct URL', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Nông dân', exact: true }).click();
  await expect(page.getByRole('link', { name: 'Thị trường', exact: true })).toHaveCount(0);
  await page.goto('/#/marketplace');
  await expect(
    page.getByRole('heading', { name: 'Không tìm thấy trang hoặc bạn chưa có quyền xem.' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Đăng xuất', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Thương lái', exact: true })).toBeVisible();
});

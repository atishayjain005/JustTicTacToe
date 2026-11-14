const { test, expect } = require('@playwright/test');
const cell = (page, i) => page.locator('#main .col').nth(i);
async function moves(page, indexes) {
  for (const i of indexes) await cell(page, i).click();
}
test.beforeEach(async ({ page }) => { await page.goto('/'); });
for (const [name, sequence] of Object.entries({
  top: [0,3,1,4,2], middle: [3,0,4,1,5], bottom: [6,0,7,1,8],
  left: [0,1,3,2,6], center: [1,0,4,2,7], right: [2,0,5,1,8],
  diagonal: [0,1,4,2,8], reverse: [2,0,4,1,6],
  playerTwo: [0,3,1,4,8,5], lastMoveWin: [0,1,2,3,4,5,7,6,8]
})) {
  test(`ends round on ${name} win`, async ({ page }) => {
    await moves(page, sequence);
    await expect(page.locator('#playtext')).toContainText(name === 'playerTwo' ? 'Player 2 (O) wins!' : 'Player 1 (X) wins!');
    const before = await page.locator('#main').innerText();
    await moves(page, [0,1,2,3,4,5,6,7,8]);
    await expect(page.locator('#main')).toHaveText(before);
  });
}
test('occupied cells do not change the turn', async ({ page }) => {
  await moves(page, [0,0,1]);
  await expect(cell(page, 0)).toHaveText('X');
  await expect(cell(page, 1)).toHaveText('O');
});
test('draw and restart clear the round', async ({ page }) => {
  await moves(page, [0,1,2,4,3,5,7,6,8]);
  await expect(page.locator('#playtext')).toHaveText("It's a draw!");
  await page.locator('#reset').click();
  await expect(page.locator('#playtext')).toHaveText('Player 1 (X) to play');
  await expect(page.locator('#main .col')).toHaveText(Array(9).fill(''));
  await moves(page, [4]);
  await expect(cell(page, 4)).toHaveText('X');
});

test('keyboard play exposes cell positions and live turns', async ({ page }) => {
  const first = page.getByRole('button', { name: 'Row 1, column 1: empty' });
  await first.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status')).toHaveText('Player 2 (O) to play');
  await expect(cell(page, 0)).toHaveAccessibleName('Row 1, column 1: X');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');
  await expect(cell(page, 1)).toHaveText('O');
  await expect(cell(page, 1)).toBeFocused();
  await expect(page.getByRole('status')).toHaveText('Player 1 (X) to play');
});

test('board fits viewport and works without external assets', async ({ page }, testInfo) => {
  await page.route('https://**/*', route => route.abort());
  await page.reload();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  for (let i = 0; i < 9; i++) {
    const bounds = await cell(page, i).boundingBox();
    expect(bounds.width).toBeGreaterThanOrEqual(44);
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(page.viewportSize().width);
  }
  await moves(page, [0,3,1,4,2]);
  await expect(page.getByRole('status')).toContainText('wins!');
  await page.screenshot({ path: testInfo.outputPath('board.png'), fullPage: true });
});

test('winning squares are marked and restart restores keyboard focus', async ({ page }) => {
  await moves(page, [0,3,1,4,2]);
  await expect(page.locator('.winning')).toHaveCount(3);
  await expect(cell(page, 0)).toHaveAccessibleName('Row 1, column 1: X, winning square');
  await page.getByRole('button', { name: 'Restart', exact: true }).click();
  await expect(page.locator('.winning')).toHaveCount(0);
  await expect(cell(page, 0)).toBeFocused();
  await expect(cell(page, 0)).toHaveAccessibleName('Row 1, column 1: empty');
  await page.keyboard.press('Space');
  await expect(cell(page, 0)).toHaveText('X');
  await expect(page.getByRole('status')).toHaveText('Player 2 (O) to play');
});
test('restart also clears a round in progress', async ({ page }) => {
  await moves(page, [0,4]);
  await page.getByRole('button', { name: 'Restart', exact: true }).click();
  await expect(page.locator('#main .col')).toHaveText(Array(9).fill(''));
  await page.keyboard.press('Enter');
  await expect(cell(page, 0)).toHaveText('X');
});

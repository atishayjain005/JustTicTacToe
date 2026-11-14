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

/**
 * @jest-environment jsdom
 */

describe('2048 Game Tests', () => {
    let grid;
    let score;
    
    beforeEach(() => {
        document.body.innerHTML = `
            <div class="grid-container"></div>
            <div id="score">0</div>
        `;
        require('./script.js');
        grid = Array(16).fill(0);
        score = 0;
    });

    describe('mergeLine', () => {
        test('should merge identical adjacent numbers', () => {
            const line = [2, 2, 4, 4];
            const result = mergeLine(line);
            expect(result).toEqual([4, 8, 0, 0]);
        });

        test('should not merge different numbers', () => {
            const line = [2, 4, 8, 16];
            const result = mergeLine(line);
            expect(result).toEqual([2, 4, 8, 16]);
        });

        test('should handle zeros correctly', () => {
            const line = [2, 0, 2, 4];
            const result = mergeLine(line);
            expect(result).toEqual([4, 4, 0, 0]);
        });
    });

    describe('canMove', () => {
        test('should return true when empty cells exist', () => {
            grid = [
                2, 4, 8, 16,
                0, 32, 64, 128,
                256, 512, 1024, 2048,
                4096, 8192, 16384, 32768
            ];
            expect(canMove()).toBe(true);
        });

        test('should return true when merges are possible', () => {
            grid = [
                2, 4, 8, 16,
                4, 32, 64, 128,
                256, 512, 1024, 2048,
                4096, 8192, 16384, 32768
            ];
            expect(canMove()).toBe(true);
        });

        test('should return false when no moves are possible', () => {
            grid = [
                2, 4, 8, 16,
                4, 32, 64, 128,
                256, 512, 1024, 2048,
                4096, 8192, 16384, 32768
            ];
            expect(canMove()).toBe(false);
        });
    });

    describe('moveTiles', () => {
        test('should move tiles left correctly', () => {
            grid = [
                2, 2, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0
            ];
            moveTiles('left');
            expect(grid.slice(0, 4)).toEqual([4, 0, 0, 0]);
        });

        test('should move tiles right correctly', () => {
            grid = [
                2, 2, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0
            ];
            moveTiles('right');
            expect(grid.slice(0, 4)).toEqual([0, 0, 0, 4]);
        });
    });
});

import { CellValue, CellState, CellType } from '../types/index';
import { MAX_ROWS, MAX_COLUMNS } from '../constants/index';

export const generateCells = (): CellType[][] => {

    const cells: CellType[][] = [];

    for (let row = 0; row < MAX_ROWS; row++) {
        cells.push([]);
        for (let col = 0; col < MAX_COLUMNS; col++) {
            cells[row].push({
                value: CellValue.none,
                state: CellState.open
            })
        }
    }
    return cells;
}
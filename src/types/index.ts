export enum CellValue {
    none,
    bomb,
    one,
    tow,
    three,
    four,
    five,
    six,
    seven,
    eight
}


export enum CellState {
    open,
    visible,
    flagged,
}

export interface CellType { value: CellValue, state: CellState }
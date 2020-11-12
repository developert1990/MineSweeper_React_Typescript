export enum CellValue {
    none,
    one,
    tow,
    three,
    four,
    five,
    six,
    seven,
    eight,
    bomb,
}


export enum CellState {
    open,
    visible,
    flagged,
}

export interface CellType { value: CellValue, state: CellState }
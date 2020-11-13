import React, { useState, useEffect } from 'react';
import './Mine.scss';
import NumberDisplay from '../NumberDisplay';
import { generateCells, openMultipleCells } from '../../utils';
import Button from '../Button';
import { CellState, CellType, CellValue, Face } from '../../types';
import { MAX_COLUMNS, MAX_ROWS } from '../../constants';



const Mine: React.FC = () => {
    const [cells, setCells] = useState<CellType[][]>(generateCells());
    // console.log('cells', cells);
    const [face, setFace] = useState<Face>(Face.smile);
    const [time, setTime] = useState<number>(0);
    const [live, setLive] = useState<boolean>(false);
    const [bombCounter, setBombCounter] = useState<number>(10);
    const [hasLost, setHasLost] = useState<boolean>(false);
    const [hasWon, setHasWon] = useState<boolean>(false);



    useEffect(() => {
        const handleMousedown = (): void => {
            setFace(Face.oh);
        }

        const handleMouseUp = (): void => {
            setFace(Face.smile)
        }
        window.addEventListener('mousedown', handleMousedown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousedown', handleMousedown);
            window.removeEventListener('mouseup', handleMouseUp);
        }
    }, []);

    useEffect(() => {
        if (live && time < 999) {
            const interval = setInterval(() => {
                setTime(time + 1);
            }, 1000)

            return () => {
                clearInterval(interval);
            }
        }

    }, [live, time]);

    useEffect(() => {
        if (hasLost) {
            setFace(Face.lost);
            setLive(false);
        }
    }, [hasLost]);

    useEffect(() => {
        if (hasWon) {
            setLive(false);
            setFace(Face.won);
        }
    }, [hasWon])

    const handleCellClick = (rowParam: number, colParam: number) => (): void => {
        // console.log(rowParam, colParam);
        let newCells = cells.slice(); // 새로운 배열을 만듬 내용은 같지만 서로 다른 배열이다. cells === newCells 해보면 false 가 나온다.

        // start the game !!
        if (!live) {
            // 첫번째로 클릭한 것이 폭탄일 경우 다시 cell을 섞는다.

            let isABomb = newCells[rowParam][colParam].value === CellValue.bomb;
            while (isABomb) {
                newCells = generateCells();
                if (newCells[rowParam][colParam].value !== CellValue.bomb) {
                    isABomb = false;
                    break;
                }
            }

            setLive(true);
        }

        const currentCell = newCells[rowParam][colParam];

        // 62번줄 [CellState.flagged, CellState.visible].includes(currentCell.state) 랑 같다
        if (currentCell.state === CellState.flagged ||
            currentCell.state === CellState.visible) {
            return;
        }

        // 폭탄을 클릭했을 경우
        if (currentCell.value === CellValue.bomb) {
            // take care of bomb click !
            setHasLost(true);
            newCells[rowParam][colParam].red = true;
            newCells = showAllBombs();
            setCells(newCells);
            return;
            // 숫자도 폭탄도 아닌 빈공간을 클릭할 경우
        } else if (currentCell.value === CellValue.none) {
            newCells = openMultipleCells(newCells, rowParam, colParam);
        } else {
            newCells[rowParam][colParam].state = CellState.visible;
        }

        // check to see if you have won
        let safeOpenCellsExists = false;
        for (let row = 0; row < MAX_ROWS; row++) {
            for (let col = 0; col < MAX_COLUMNS; col++) {
                const currentCell = newCells[row][col];

                if (currentCell.value !== CellValue.bomb && currentCell.state === CellState.open) {
                    safeOpenCellsExists = true;
                    break;
                }
            }
        }
        if (!safeOpenCellsExists) {
            newCells = newCells.map(row => row.map(cell => {
                if (cell.value === CellValue.bomb) {
                    return {
                        ...cell,
                        state: CellState.flagged
                    }
                }
                return cell;
            }))
            setHasWon(true);
        }

        setCells(newCells);

    }



    const handleCellContext = (rowParam: number, colParam: number) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        e.preventDefault();
        console.log('오른쪽 클릭함');

        if (!live) {
            return;
        }

        const currentCells = cells.slice();
        const currentCell = cells[rowParam][colParam];
        if (currentCell.state === CellState.visible) {
            return;
            // 플래그 나타내고 카운터 하나 줄여주기
        } else if (currentCell.state === CellState.open) {
            currentCells[rowParam][colParam].state = CellState.flagged;
            setCells(currentCells);
            setBombCounter(bombCounter - 1);
            // 플레그 없애고 카운터 하나 늘리기
        } else if (currentCell.state === CellState.flagged) {

            currentCells[rowParam][colParam].state = CellState.open;
            setCells(currentCells);
            setBombCounter(bombCounter + 1);
        }
    }

    const handleFaceClick = (): void => {

        setLive(false);
        setTime(0);
        setCells(generateCells());
        setHasLost(false);
        setHasWon(false);
    }

    const renderCells = (): React.ReactNode => {
        return cells.map((row, rowIndex) => row.map((cell, colIndex) =>
            <Button
                key={`${rowIndex}- ${colIndex}`}
                state={cell.state}
                value={cell.value}
                onClick={handleCellClick}
                onContext={handleCellContext}
                red={cell.red}
                row={rowIndex}
                col={colIndex}
            />
        ))
    }

    const showAllBombs = (): CellType[][] => {
        const currentCells = cells.slice();
        return currentCells.map((row => row.map(cell => {
            if (cell.value === CellValue.bomb) {
                return {
                    ...cell,
                    state: CellState.visible
                };
            }
            return cell;
        })))
    }


    return (
        <div className="Mine">

            <div className="Header">
                <NumberDisplay value={bombCounter} />
                <div className="Face" onClick={handleFaceClick}>
                    <span role="img" aria-label="face">
                        {face}
                    </span>

                </div>
                <NumberDisplay value={time} />
            </div>

            <div className="Body">
                {renderCells()}
            </div>
        </div>
    )
}

export default Mine;
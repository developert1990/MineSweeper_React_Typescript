import React, { useState, useEffect } from 'react';
import './Mine.scss';
import NumberDisplay from '../NumberDisplay';
import { generateCells } from '../../utils';
import Button from '../Button';
import { CellState, CellType, Face } from '../../types';



const Mine: React.FC = () => {
    const [cells, setCells] = useState<CellType[][]>(generateCells());
    // console.log('cells', cells);
    const [face, setFace] = useState<Face>(Face.smile);
    const [time, setTime] = useState<number>(0);
    const [live, setLive] = useState<boolean>(false);
    const [bombCounter, setBombCounter] = useState<number>(10);



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

    }, [live, time])

    const handleCellClick = (rowParam: number, colParam: number) => (): void => {
        // console.log(rowParam, colParam);
        if (!live) {
            setLive(true);
        }
    }

    const handleFaceClick = (): void => {
        if (live) {
            setLive(false);
            setTime(0);
            setCells(generateCells());
        }
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

    const renderCells = (): React.ReactNode => {
        return cells.map((row, rowIndex) => row.map((cell, colIndex) =>
            <Button
                key={`${rowIndex}- ${colIndex}`}
                state={cell.state}
                value={cell.value}
                onClick={handleCellClick}
                onContext={handleCellContext}
                row={rowIndex}
                col={colIndex}
            />
        ))
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
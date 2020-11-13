import React from 'react';
import { CellState, CellValue } from '../../types';
import './Button.scss';

interface ButtonProps {
    row: number;
    col: number;
    state: CellState;
    value: CellValue;
    onClick(rowParam: number, colParam: number): (...args: any[]) => void; // 일반적인 제네릭 함수를 리턴할때 이렇게 쓴다.
    onContext(rowParam: number, colParam: number): (...args: any[]) => void;
    red?: boolean;
}

const Button: React.FC<ButtonProps> = ({ row, col, state, value, onClick, onContext, red }) => {

    const renderContent = (): React.ReactNode => {
        if (state === CellState.visible) {
            if (value === CellValue.bomb) {
                return (
                    <span role="img" aria-label="face">
                        💣
                    </span>
                )
            } else if (value === CellValue.none) {
                return null;
            }

            return value;

        } else if (state === CellState.flagged) {
            return (
                <span role="img" aria-label="face">
                    🚩
                </span>
            )
        }
        return null;
    }

    return (
        <div
            className={`Button 
            ${state === CellState.visible ? 'visible' : ""} value-${value} ${red ? 'red' : ''}`}
            onClick={onClick(row, col)}
            onContextMenu={onContext(row, col)}
        >
            {renderContent()}
        </div>
    )
}

export default Button;
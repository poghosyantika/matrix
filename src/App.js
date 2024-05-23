import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [sizeInput, setSizeInput] = useState('');
  const [size, setSize] = useState(0);
  const [matrix, setMatrix] = useState([]);
  const [showMatrix, setShowMatrix] = useState(false);
  const [disabledSubmit, setDisabledSubmit] = useState(true);

  const handleSizeInputChange = (e) => {
    setSizeInput(e.target.value);
  };

  const generateMatrix = () => {
    const parsedValue = parseInt(sizeInput, 10);
    if (!isNaN(parsedValue) && parsedValue > 0) {
      setSize(parsedValue);
    } else {
      alert('Please enter a valid positive integer for the matrix size.');
      setSize(0);
    }
  };

  useEffect(() => {
    if (size > 0) {
      const newMatrix = Array(size).fill().map(() => Array(size).fill(''));
      setMatrix(newMatrix);
    } else {
      setMatrix([]);
    }
  }, [size]);

  useEffect(() => {
    const allFilled = matrix.flat().every(cell => cell !== '');
    setDisabledSubmit(!allFilled);
  }, [matrix]);

  const handleMatrixChange = (rowIndex, colIndex, value) => {
    const newMatrix = matrix.map((row, rIdx) =>
      row.map((cell, cIdx) =>
        (rIdx === rowIndex && cIdx === colIndex) ? value : cell
      )
    );
    setMatrix(newMatrix);
  };

  const handleCellChange = (e, rowIndex, colIndex) => {
    const value = e.target.value;
    if (value === '' || value === '0' || value === '1') {
      handleMatrixChange(rowIndex, colIndex, value);
    }
  };

  const handleCellBlur = (e, rowIndex, colIndex) => {
    const value = e.target.value;
    if (value !== '0' && value !== '1') {
      alert('Please enter 0 or 1.');
      handleMatrixChange(rowIndex, colIndex, '');
    }
  };

  const convertMatrixToString = (matrix) => {
    return matrix.map(row => row.join('')).join('');
  };

  const handleSubmit = async () => {
    setShowMatrix(true);
    const matrixString = convertMatrixToString(matrix);
    try {
      const response = await fetch(`http://127.0.0.1:8085/cgi-bin/CGISample.exe?matrix=${encodeURIComponent(matrixString)}`, {
        method: 'GET'
      });

      console.log(response, 'response')

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const text = await response.text();
      console.log('API Response:', text);
    } catch (error) {
      console.error('Fetch error:', error);
      alert(`Failed to fetch: ${error.message}`);
    }
  };

  return (
    <div className="App">
      <h1>Matrix Input</h1>
      <div className="container">
        <div className="input-section">
          <label>
            Matrix Size (NxN):
            <input type="text" value={sizeInput} onChange={handleSizeInputChange} placeholder="e.g., 3" />
          </label>
          <button onClick={generateMatrix}>Generate Matrix</button>

          {size > 0 && (
            <>
              <div className="matrix">
              <div className="matrix-row">
              <div className="matrix-header-cell"></div>
                {Array.from({ length: size }, (_, colIndex) => (
                  <div key={colIndex} className="matrix-header-cell">{colIndex + 1}</div>
                ))}
              </div>
              {matrix.map((row, rowIndex) => (
                <div key={rowIndex} className="matrix-row">
                <div className="matrix-header-cell">{rowIndex + 1}</div>
                {row.map((cell, colIndex) => (
                   <input
                   key={`${rowIndex}-${colIndex}`}
                   className="matrix-cell"
                   type="text"
                   value={cell}
                   onChange={(e) => handleCellChange(e, rowIndex, colIndex)}
                   onBlur={(e) => handleCellBlur(e, rowIndex, colIndex)}
                 />
                  ))}
                </div>
                ))}
                </div>
              <button onClick={handleSubmit} disabled={disabledSubmit}>Submit</button>
            </>
          )}
        </div>
        <div className="divider"></div>
        {showMatrix && (
          <div className="output-section">
            <h2>Matrix</h2>
            <div className="matrix">
              <div className="matrix-row">
                <div className="matrix-header-cell"></div>
                {Array.from({ length: size }, (_, colIndex) => (
                  <div key={colIndex} className="matrix-header-cell">{colIndex + 1}</div>
                ))}
              </div>
              {matrix.map((row, rowIndex) => (
                <div key={rowIndex} className="matrix-row">
                  <div className="matrix-header-cell">{rowIndex + 1}</div>
                  {row.map((cell, colIndex) => (
                    <div key={`${rowIndex}-${colIndex}`} className="matrix-cell">
                      {cell}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

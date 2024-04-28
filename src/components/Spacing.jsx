import React, { useState, useEffect } from 'react';
import styles from '../styles/spacings.module.css';

function Spacing({ spacingId, spacingData }) {
  const [spacingValues, setSpacingValues] = useState({
    baseValue: spacingData.baseValue,
    variantCount: spacingData.variantCount,
  });

  const handleSpacingChange = (field, value) => {
    setSpacingValues(prevValues => ({
      ...prevValues,
      [field]: value,
    }));
  };

  return (
    <div className={styles.container}>
      <SpacingInput
        spacingId={spacingId}
        spacing={spacingValues}
        onSpacingChange={handleSpacingChange}
      />
      <SpacingBox
        spacing={spacingValues}
        onSpacingChange={handleSpacingChange}
      />
    </div>
  );
}

function SpacingInput({ spacingId, spacing, onSpacingChange }) {
  return (
    <div className={styles.inputContainer}>
      <label className={styles.label}>
        Base Size:
        <select
          value={spacing.baseValue}
          onChange={e => onSpacingChange('baseValue', Number(e.target.value))}
          className={styles.select}
        >
          {[6, 8, 12].map(i => (
            <option key={i} value={i}>{i}px</option>
          ))}
        </select>
      </label>
      <label className={styles.label}>
        Variant Count:
        <input
          type="number"
          min="8"
          value={spacing.variantCount}
          onChange={e => onSpacingChange('variantCount', Number(e.target.value))}
          className={styles.input}
        />
      </label>

      <button className={styles.button} onClick={async () => {
        const response = await fetch(`https://design-system-api.onrender.com/spacing/${spacingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(spacing)
        });
        const data = await response.json();
        console.log(data.message);
      }}>Save Spacing</button>
    </div>
  );
}

function SpacingBox({ spacing, onSpacingChange }) {
  const [sizes, setSizes] = useState(
    [...Array(spacing.variantCount)].map((_, i) => i === 2 ? spacing.baseValue : spacing.baseValue - 4 + i * 2)
  );
  const sizeNames = ['xxs', 'xs', 's', 'sm', 'm', 'ml', 'l', 'xl', '2xl', '3xl', '4xl', '5xl'];

  useEffect(() => {
    setSizes(
      [...Array(spacing.variantCount)].map((_, i) => i === 2 ? spacing.baseValue : spacing.baseValue - 4 + i * 2)
    );
  }, [spacing.baseValue, spacing.variantCount]);

  const handleSizeNameChange = (index, value) => {
    const newSizeNames = [...sizeNames];
    newSizeNames[index] = value;
    onSpacingChange('sizeNames', newSizeNames);
  };

  const handleSizeChange = (index, value) => {
    const newSizes = [...sizes];
    newSizes[index] = Number(value);
    setSizes(newSizes);
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Variable Name</th>
          <th>Size (px)</th>
          <th>Size (rem)</th>
          <th>Preview</th>
        </tr>
      </thead>
      <tbody>
        {sizes.map((size, i) => (
          <tr key={i}>
            <td>
              <input
                type="text"
                value={sizeNames[i]}
                onChange={e => handleSizeNameChange(i, e.target.value)}
              />
            </td>
            <td>
              <select
                value={size}
                onChange={e => handleSizeChange(i, Number(e.target.value))}
              >
                {[...Array(33).keys()].map(j => (
                  <option key={j} value={j}>{j}px</option>
                ))}
              </select>
            </td>
            <td>
              <input
                type="text"
                value={`${size / 16}rem`}
                disabled
              />
            </td>
            <td>
              <div
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: '#808080',
                  border: '1px solid #FF0000',
                }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Spacing;

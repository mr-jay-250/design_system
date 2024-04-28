import React, { useEffect, useState } from 'react';
import styles from '../styles/radius.module.css';

function Radius({ radiusId, radiusData }) {
  const [radiusValues, setRadiusValues] = useState({
    sharpRadius: false,
    baseSize: radiusData.baseValue,
    variantCount: radiusData.variantCount,
    multiplier: radiusData.multiplier,
  });

  const handleRadiusChange = (field, value) => {
    setRadiusValues(prevValues => ({
      ...prevValues,
      [field]: value,
    }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <RadiusInput
          radius={radiusValues}
          onRadiusChange={handleRadiusChange}
          radiusId={radiusId}
        />
      </div>
      <div className={styles.right}>
        <RadiusBox
          radius={radiusValues}
          onRadiusChange={handleRadiusChange}
        />
      </div>
    </div>
  );
}

function RadiusInput({ radius, onRadiusChange, radiusId }) {
  return (
    <div className={styles.inputContainer}>
      <label className={styles.label}>
        Sharp Radius:
        <div className={styles.toggleSwitch}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={radius.sharpRadius}
            onChange={e => onRadiusChange('sharpRadius', e.target.checked)}
          />
          <span className={`${styles.slider} ${styles.round}`}></span>
        </div>
      </label>
      <label className={styles.label}>
        Base Size:
        <select
          value={radius.baseSize}
          onChange={e => onRadiusChange('baseSize', Number(e.target.value))}
          disabled={radius.sharpRadius}
        >
          {[...Array(33).keys()].map(i => (
            <option key={i} value={i}>{i}px</option>
          ))}
        </select>
      </label>
      <label className={styles.label}>
        Variant Count:
        <input
          type="number"
          min="4"
          value={radius.variantCount}
          className={styles.inputEl}
          onChange={e => onRadiusChange('variantCount', Number(e.target.value))}
          disabled={radius.sharpRadius}
        />
      </label>
      <label className={styles.label}>
        Multiplier:
        <input
          type="number"
          min="2"
          className={styles.inputEl}
          value={radius.multiplier}
          onChange={e => onRadiusChange('multiplier', Number(e.target.value))}
          disabled={radius.sharpRadius}
        />
      </label>
      <button className={styles.button} onClick={async () => {
        const response = await fetch(`http://localhost:4000/radius/${radiusId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(radius)
        });
        const data = await response.json();
        console.log(data.message);
      }}>Save Radius</button>
    </div>
  );
}

function RadiusBox({ radius, onRadiusChange }) {
  const [sizes, setSizes] = useState(
    [...Array(radius.variantCount)].map((_, i) => radius.baseSize * radius.multiplier ** i)
  );

  useEffect(() => {
    setSizes(
      [...Array(radius.variantCount)].map((_, i) => radius.baseSize * radius.multiplier ** i)
    );
  }, [radius.baseSize, radius.multiplier, radius.variantCount]);

  const handleSizeChange = (index, value) => {
    if (index === 0) {
      onRadiusChange('baseSize', Number(value));
    } else {
      const newSizes = [...sizes];
      newSizes[index] = value;
      setSizes(newSizes);
    }
  };

  return (
    <div className={styles.boxContainer}>
      <table>
        <thead>
          <tr>
            <th>Size (px)</th>
            <th>Preview</th>
          </tr>
        </thead>
        <tbody>
          {sizes.map((size, i) => (
            <tr key={i}>
              <td>
                <input
                  type="number"
                  value={size}
                  onChange={e => handleSizeChange(i, e.target.value)}
                  disabled={radius.sharpRadius}
                />
              </td>
              <td>
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: radius.sharpRadius ? '0px' : `${size}px`,
                    backgroundColor: '#808080',
                    border: '1px solid #FF0000',
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Radius;

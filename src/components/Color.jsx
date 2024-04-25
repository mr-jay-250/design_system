import React, { useEffect, useState } from 'react';
import styles from '../styles/color.module.css';

function Color({ colorId, colorData }) {
  const [colorValues, setColorValues] = useState({});
  const [colorOrder, setColorOrder] = useState([]);
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    if (colorData && colorData.length > 0) {
      const colors = {};
      const order = [];
      colorData.forEach(color => {
        colors[color.colorName] = {
          name: color.colorName,
          hex: color.hexValue,
          count: color.variantCount
        };
        order.push(color.colorName);
      });
      console.log('colors.......',colors);
      setColorValues(colors);
      setColorOrder(order);
      setSelectedColor(order[0]);
    }
  }, [colorData]);

  const handleColorChange = (name, field, value) => {
    setColorValues(prevValues => {
      let newColorValues;
      if (field === 'name') {
        const { [name]: colorData, ...rest } = prevValues;
        newColorValues = {
          ...rest,
          [value]: { ...colorData, [field]: value },
        };
        if (name === selectedColor) {
          setSelectedColor(value);
        }
        setColorOrder(prevOrder => prevOrder.map(colorName => colorName === name ? value : colorName));
      } else {
        newColorValues = {
          ...prevValues,
          [name]: { ...prevValues[name], [field]: value },
        };
      }
      return newColorValues;
    });
  };

  const handleAddColor = async () => {
    const newName = 'New Color';
    setColorValues(prevValues => ({
      ...prevValues,
      [newName]: { name: newName, hex: '#000000', count: 5 },
    }));
    setColorOrder(prevOrder => [...prevOrder, newName]);

    const response = await fetch('https://design-system-api.onrender.com/colors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId: colorId, colorName: newName, hexValue: '#000000', variantCount: 5 })
    });
    const data = await response.json();
    console.log(data.message);
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        {colorOrder.map(colorName => (
          <Accordion
            key={colorName}
            color={colorValues[colorName]}
            onColorChange={handleColorChange}
            onColorSelect={setSelectedColor}
            isSelected={colorName === selectedColor}
          />
        ))}
        <button onClick={handleAddColor}>+</button>
        <button onClick={async () => {
          const response = await fetch(`https://design-system-api.onrender.com/color/${colorId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(colorValues)
          });
          const data = await response.json();
          console.log(data.message);
        }}>Save Color</button>
      </div>
      <div className={styles.boxes}>
        {selectedColor && (
          <ColorBox
            color={colorValues[selectedColor]}
            onColorChange={handleColorChange}
          />
        )}
      </div>
    </div>
  );
}

function Accordion({ color, onColorChange, onColorSelect, isSelected }) {
  return (
    <div onClick={() => onColorSelect(color.name)} className={`${styles.accordion} ${isSelected ? styles.active : ''}`}>
      <h2>{color.name}</h2>
      {isSelected && (
        <>
          <label>
            Variable Name:
            <input
              type="text"
              value={color.name}
              onChange={e => onColorChange(color.name, 'name', e.target.value)}
            />
          </label>
          <label>
            Enter HEX value:
            <input
              type="text"
              value={color.hex}
              onChange={e => onColorChange(color.name, 'hex', e.target.value)}
            />
          </label>
          <label>
            Variant Count:
            <input
              type="number"
              min="5"
              value={color.count}
              onChange={e => onColorChange(color.name, 'count', e.target.value)}
            />
          </label>
        </>
      )}
    </div>
  );
}

function ColorBox({ color, onColorChange }) {
  return (
    <>
      {[...Array(Number(color.count))].map((_, i) => {
        const index = String(i + 1).padStart(3, '0');
        return (
          <div
            className={styles.box}
            key={i}
            style={{
              opacity: (i + 1) / color.count,
              backgroundColor: color.hex,
            }}
          >
            <div>{`${color.name}${index}`}</div>
            <input
              className={styles.boxes}
              type="color"
              value={color.hex}
              onChange={e => onColorChange(color.name, 'hex', e.target.value)}
            />
          </div>
        );
      })}
    </>
  );
}

export default Color;

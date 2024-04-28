import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../styles/userInteraction.module.css";

function UserInteractionComponent() {
  const { id_of_project } = useParams();
  const [colorValues, setColorValues] = useState({});
  const [project, setProject] = useState({});
  const [radiusValues, setRadiusValues] = useState({});
  const [sizes, setSizes] = useState([]);
  const [spacingValues, setSpacingValues] = useState({});
  const [spacingSizes, setSpacingSizes] = useState([]);

  useEffect(() => {
    const fetchProject = async () => {
      const response = await fetch(
        `http://localhost:4000/projects/${id_of_project}`
      );
      const data = await response.json();

      setProject(data);
    };
    fetchProject();
  }, [id_of_project]);

  useEffect(() => {
    const { radiu } = project;
    if (radiu) {
      const { baseValue, variantCount, multiplier } = radiu;
      setRadiusValues({ baseSize: baseValue, variantCount, multiplier });
    }

    const { spacing } = project;

    if (spacing) {
      const { baseValue, variantCount } = radiu;
      setSpacingValues({ baseValue, variantCount });
    }
  }, [project]);

  useEffect(() => {
    if (
      radiusValues.variantCount !== undefined &&
      radiusValues.baseSize !== undefined &&
      radiusValues.multiplier !== undefined
    ) {
      setSizes(
        [...Array(radiusValues.variantCount)].map(
          (_, i) => radiusValues.baseSize * radiusValues.multiplier ** i
        )
      );
    }

    if (
      spacingValues.variantCount !== undefined &&
      spacingValues.baseValue !== undefined
    ) {
      setSpacingSizes(
        [...Array(spacingValues.variantCount)].map((_, i) =>
          i === 2
            ? spacingValues.baseValue
            : spacingValues.baseValue - 4 + i * 2
        )
      );
    }
  }, [radiusValues, spacingValues]);

  useEffect(() => {
    if (project.colors && project.colors.length > 0) {
      const colors = {};
      project.colors.forEach((color) => {
        colors[color.colorName] = {
          name: color.colorName,
          hex: color.hexValue,
          count: color.variantCount,
          id: color.id,
        };
      });
      setColorValues(colors);
    }
  }, [project.colors]);

  return (
    <div className={styles.container}>
      <div className={styles.colorContainer}>
        <div style={{ height: '112px' }}>
          <h2>Color Variations</h2>
          <p>Variations of button colors</p>
        </div>
        <div style={{ border: '1px solid black', marginBottom: '20px' }} />
        {Object.values(colorValues).map((colorData) => (
          <div key={colorData.id} className={styles.colorGroup}>
            <h3>{colorData.name}</h3>
            {Array.from({ length: colorData.count }).map((_, index) => (
              <button
                key={index}
                className={styles.colorButton}
                style={{
                  backgroundColor: colorData.hex,
                }}
              >
                <div>{`${colorData.name}${index}`}</div>
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className={styles.sizeContainer}>
        <div style={{ height: '112px' }}>
          <h2>Radius Variations</h2>
          <p>Variations of border-radius in input field and background color for radio and checkbox</p>
        </div>
        <div style={{ border: '1px solid black', marginBottom: '20px' }} />
        {sizes.map((size, i) => (
          <div key={i} className={styles.sizeGroup}>
            <div className={styles.inputContainer}>
              <label htmlFor={`text-${i}`}>Text:</label>
              <input
                id={`text-${i}`}
                type="text"
                className={styles.sizeInput}
                style={{
                  borderRadius: `${size}px`,
                }}
              />
            </div>
            <div
              style={{ borderRadius: `${size}px` }}
              className={styles.selectContainer}
            >
              <label htmlFor={`radio-${i}`}>Radio:</label>
              <input
                id={`radio-${i}`}
                type="radio"
                className={styles.sizeInput}
                style={{
                  borderRadius: `${size}px`,
                }}
              />
            </div>
            <div
              style={{ borderRadius: `${size}px` }}
              className={styles.selectContainer}
            >
              <label htmlFor={`checkbox-${i}`}>Checkbox:</label>
              <input
                id={`checkbox-${i}`}
                type="checkbox"
                className={styles.sizeInput}
                style={{
                  borderRadius: `${size}px`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className={styles.sizeContainer}>
        <div style={{ height: '112px' }}>
          <h2>Spacing Variations</h2>
          <p>Variations of spacing in gap between label and select element</p>
        </div>
        <div style={{ border: '1px solid black', marginBottom: '20px' }} />
        {spacingSizes.map((size, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: `${(size += 2)}px`,
            }}
            className={styles.selectSpacingContainer}
          >
            <label htmlFor="select">Slect Option:</label>
            <select name="select" value={size}>
              {[...Array(33).keys()].map((j) => (
                <option key={j} value={j}>
                  {j}px
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserInteractionComponent;

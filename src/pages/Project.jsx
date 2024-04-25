import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Color from '../components/Color';
import Radius from '../components/Radius';
import Spacing from '../components/Spacing';
import '../styles/project.css';

function ProjectPage() {
  const { id_of_project } = useParams();
  const [projectName, setProjectName] = useState('');
  const [activeComponent, setActiveComponent] = useState('color');
  const [spacingId, setSpacingId] = useState(null);
  const [colorId, setColorId] = useState(null);
  const [radiusId, setRadiusId] = useState(null);
  const [project, setProject] = useState({});

  useEffect(() => {
    const fetchProject = async () => {
      const response = await fetch(`https://design-system-api.onrender.com/projects/${id_of_project}`);
      const data = await response.json();
      
      setProjectName(data.name);
      setSpacingId(data.spacing.id);
      setColorId(data.colors[0].id);
      setRadiusId(data.radiu.id);
      setProject(data);
    };
    fetchProject();
  }, [id_of_project]);

  const handleSetActiveComponent = (component) => {
    setActiveComponent(component);
  };

  return (
    <>
      <div className="out-container">
        <h1>Project: {projectName}</h1>
        <nav className="navbar">
          <ul>
            <li><button className={activeComponent === 'color' ? 'active' : ''} onClick={() => handleSetActiveComponent('color')}>Color</button></li>
            <li><button className={activeComponent === 'radius' ? 'active' : ''} onClick={() => handleSetActiveComponent('radius')}>Radius</button></li>
            <li><button className={activeComponent === 'spacing' ? 'active' : ''} onClick={() => handleSetActiveComponent('spacing')}>Spacing</button></li>
          </ul>
        </nav>
      </div>

      <div className="section">
          {activeComponent === 'color' && (
            <>
              <h2>Color</h2>
              <Color colorId={colorId} colorData={project.colors} />
            </>
          )}

          {activeComponent === 'radius' && (
            <>
              <h2>Radius</h2>
              <Radius radiusId={radiusId} radiusData={project.radiu} />
            </>
          )}

          {activeComponent === 'spacing' && (
            <>
              <h2>Spacing</h2>
              <Spacing spacingId={spacingId} spacingData={project.spacing} />
            </>
          )}
        </div>
    </>
  );
}

export default ProjectPage;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Color from '../components/Color';
import Radius from '../components/Radius';
import Spacing from '../components/Spacing';
import UserInteractionComponent from '../components/UserInteractionComponent';
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
      const response = await fetch(`http://localhost:4000/projects/${id_of_project}`);
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
            <li><button onClick={() => handleSetActiveComponent('color')} className={activeComponent === 'color' ? 'active' : ''}>Color</button></li>
            <li><button onClick={() => handleSetActiveComponent('radius')} className={activeComponent === 'radius' ? 'active' : ''}>Radius</button></li>
            <li><button onClick={() => handleSetActiveComponent('spacing')} className={activeComponent === 'spacing' ? 'active' : ''}>Spacing</button></li>
            <li><button onClick={() => handleSetActiveComponent('user-component')} className={activeComponent === 'user-component' ? 'active' : ''}>User Component</button></li>
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

        {activeComponent === 'user-component' && (
          <>
            <h2>User Component</h2>
            <UserInteractionComponent
              colorData={project.colors}
              colorVariants={['#ff0000', '#00ff00', '#0000ff']} // Example colors
              radiusVariants={['5px', '10px', '15px']} // Example radii
              spacingVariants={['100px', '150px', '200px']} // Example spacings
            />
          </>
        )}
      </div>
    </>
  );
}

export default ProjectPage;

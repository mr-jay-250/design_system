import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/home.module.css';

function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`https://design-system-api.onrender.com/users/${localStorage.getItem('userId')}/projects`);
        const data = await response.json();
        setProjects(data.projects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleCreateProject = async () => {
    try {
      const response = await fetch('https://design-system-api.onrender.com/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: projectName, userId: localStorage.getItem('userId') })
      });
      const data = await response.json();
      window.location.href = `/project/${data.projectId}`;
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to Home Page</h1>
      <button className={styles.button} onClick={toggleModal}>Create New Project</button>

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.close} onClick={toggleModal}>&times;</span>
            <h2>Create New Project</h2>
            <label>
              Project Name:
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className={styles.modalInput}
              />
            </label>
            <button onClick={handleCreateProject} className={styles.modalButton}>Create</button>
          </div>
        </div>
      )}

      <div className={styles.projectsContainer}>
        <h2 className={styles.projectsTitle}>Your Projects</h2>
        <div className={styles.projectsList}>
          {projects.map(project => (
            <Link key={project.id} to={`/project/${project.id}`} className={styles.projectItem}>
              {project.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;

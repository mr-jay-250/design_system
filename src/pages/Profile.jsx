import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/profile.module.css';

function Profile() {
  const [profile, setProfile] = useState({ email: '', projects: [] });
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch(`https://design-system-api.onrender.com/users/${userId}/profile`);
      const data = await response.json();
      setProfile(data);
    };
    fetchProfile();
  }, [userId]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your Profile</h1>
      <div className={styles.profileInfo}>
        <p className={styles.infoItem}>📧 Email: {profile.email}</p>
        <p className={styles.infoItem}>📊 Number of Projects: {profile.projects.length}</p>
      </div>
      <h2 className={styles.projectTitle}>Your Projects</h2>
      <div className={styles.projects}>
        {profile.projects.map(project => (
          <div key={project.id} className={styles.projectItem}>
            <h3 className={styles.projectName}>{project.name}</h3>
            <Link to={`/project/${project.id}`} className={styles.projectLink}>Go to project</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;

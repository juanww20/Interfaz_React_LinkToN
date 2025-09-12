import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import styles from './UsuarioPerfil.module.css';
import { userService } from '../services/project_2/userService';

async function LoadThisUserData() {
    try {
        const userId = await userService.getUserID();
        console.log("User ID:", userId);
        const UserData = await userService.getUserById(userId);
        console.log("User Data:", UserData);
        return UserData.data;
    } catch (error) {
        console.error("Error fetching user ID:", error);
    }
}

function UsuarioPerfil() {
  const [UserData, SetUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    LoadThisUserData().then((data) => {
      SetUserData(data);
    });
  }, []);

    const goToEdit = () => {
        // Navegar a la página de edición
        navigate('/editar');
    };

  return (
    <div>
        <main className={styles.mainContent}>
            <section className={styles.profileSection}>
                <div className={styles.avatarContainer}>
                    <img src={UserData?.image} alt="Profile" className={styles.avatar} />
                </div>
                
                <div className={styles.infoCard}>
                    <h2 className={styles.infoTitle}>Información perfil personal</h2>
                    
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Nombre: </span>
                        <span className={styles.infoValue}>{UserData?.firstName}</span>
                    </div>
                    
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Teléfono: </span>
                        <span className={styles.infoValue}>{UserData?.phone}</span>
                    </div>
                    
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Correo: </span>
                        <span className={styles.infoValue}>{UserData?.email}</span>
                    </div>
                    
                    <button className={styles.editBtn} onClick={goToEdit}>
                        Editar
                    </button>
                </div>
            </section>
        </main>
    </div>
  )
}

export default UsuarioPerfil
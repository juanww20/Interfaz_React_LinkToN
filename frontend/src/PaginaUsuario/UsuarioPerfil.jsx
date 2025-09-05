import React from 'react'
import { useNavigate } from 'react-router-dom';
import styles from './UsuarioPerfil.module.css';
import icono_perfil from '../assets/img/team-1.jpg'

function UsuarioPerfil() {
  const Datos_simular = {
    firstName: "Ado",
    phone:"04125863258",
    email:"Ado@gmail.com",
    image:icono_perfil
  }
  const navigate = useNavigate();

    const goToEdit = () => {
        // Navegar a la página de edición
        navigate('/editar');
    };

  return (
    <div>
        <main className={styles.mainContent}>
            <section className={styles.profileSection}>
                <div className={styles.avatarContainer}>
                    <img src={Datos_simular.image} alt="Profile" className={styles.avatar} />
                </div>
                
                <div className={styles.infoCard}>
                    <h2 className={styles.infoTitle}>Información perfil personal</h2>
                    
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Nombre: </span>
                        <span className={styles.infoValue}>{Datos_simular.firstName}</span>
                    </div>
                    
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Teléfono: </span>
                        <span className={styles.infoValue}>{Datos_simular.phone}</span>
                    </div>
                    
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Correo: </span>
                        <span className={styles.infoValue}>{Datos_simular.email}</span>
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
import React, { useState } from 'react';
import ColorsPanel from './Admin_componentes/ColoresComponente';
import TypographyPanel from './Admin_componentes/FuenteComponente';
import UsersPanel from './Admin_componentes/DatatableComponente';
import LoaderConfig from './Admin_componentes/LoaderConfig';
import FotosEditar from './Admin_componentes/FotosEditar';
import VideosEditar from './Admin_componentes/VideosEditar';
import styles from './Admin.module.css';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('colors');

  return (
    <div className={styles.admin_panel}>
      <div className={styles.tab_nav}>
        <button
          onClick={() => setActiveTab('colors')}
          className={`${styles.tab} ${activeTab === 'colors' ? styles.tabActive : ''}`}
        >
          🎨 Colores
        </button>
        <button
          onClick={() => setActiveTab('typography')}
          className={`${styles.tab} ${activeTab === 'typography' ? styles.tabActive : ''}`}
        >
          🔤 Tipografía
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`${styles.tab} ${activeTab === 'users' ? styles.tabActive : ''}`}
        >
          👤 Usuarios
        </button>
        <button
          onClick={() => setActiveTab('loaderconfig')}
          className={`${styles.tab} ${activeTab === 'loaderconfig' ? styles.tabActive : ''}`}
        >
          ⏳ Loader
        </button>
        <button
          onClick={() => setActiveTab('fotoseditar')}
          className={`${styles.tab} ${activeTab === 'fotoseditar' ? styles.tabActive : ''}`}
        >
          📷 Fotos
        </button>
        <button
          onClick={() => setActiveTab('videoseditar')}
          className={`${styles.tab} ${activeTab === 'videoseditar' ? styles.tabActive : ''}`}
        >
          🎥 Videos
        </button>
      </div>

      {activeTab === 'colors' && <ColorsPanel />}
      {activeTab === 'typography' && <TypographyPanel />}
      {activeTab === 'users' && <UsersPanel />}
      {activeTab === 'loaderconfig' && <LoaderConfig />}
      {activeTab === 'fotoseditar' && <FotosEditar />}
      {activeTab === 'videoseditar' && <VideosEditar />}
    </div>
  );
};

export default AdminPanel;
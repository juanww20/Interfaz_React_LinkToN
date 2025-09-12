import React, { useState, useEffect, useMemo } from 'react';
import styles from './ComponenteTangram.module.css';
import Cubo from './Cubo';
import TrianguloGrande_1 from './TrianguloGrande_1';
import TrianguloGrande_2 from './TrianguloGrande_2';
import TrianguloMediano from './TrianguloMediano';
import TrianguloPeque_1 from './TrianguloPeque_1';
import TrianguloPeque_2 from './TrianguloPeque_2';
import Romboide from './Romboide';

const pasos = [

  // Paso 0 (figura1)
  {
    'triangulo-grande-1': {
      transform: 'translate3d(-84px, 480px, 200px) rotateZ(-135deg)', zIndex: 3
    },
    'triangulo-grande-2': {
      transform: 'translate3d(110px, 0px, 200px) rotate(45deg) rotateZ(0deg)', zIndex: 4
    },
    'triangulo-mediano': {
      transform: 'translate3d(177px, 160px, 235px) rotateX(-20deg) rotateY(0deg)', zIndex: 5
    },
    'triangulo-peque-1': {
      transform: 'translate3d(70px, 85px, 220px) rotateX(0deg) rotateZ(-41deg) rotateY(0deg)', zIndex: 6
    },
    'triangulo-peque-2': {
      transform: 'translate3d(383px, 178px, 220px) rotateZ(48deg) rotateY(0deg)', zIndex: 7
    },
    'romboide': {
      transform:  'translate3d(33px, 240px, 220px) rotateZ(-45deg) rotateY(0deg)', zIndex: 7
    },
    'cubo': {
      width: '100px', height: '100px', transform: 'translate3d(290px, 80px, 240px) rotateX(0deg) rotateY(0deg)', zIndex: 9
    }
    
  }, 

  // Paso 1 (intermedio, ejemplo)
  {
    'triangulo-grande-1': {
      transform: 'translate3d(-84px, 480px, 200px) rotateZ(-135deg)', zIndex: 3
    },
    'triangulo-grande-2': {
      transform: 'translate3d(110px, 0px, 230px) rotate(45deg) rotateZ(0deg)', zIndex: 4
    },
    'triangulo-mediano': {
      transform: 'translate3d(177px, 160px, 145px) rotateX(-20deg) rotateY(0deg)', zIndex: 5
    },
    'triangulo-peque-1': {
      transform: 'translate3d(70px, 85px, 280px) rotateX(0deg) rotateZ(-41deg) rotateY(0deg)', zIndex: 6
    },
    'triangulo-peque-2': {
      transform: 'translate3d(383px, 178px, 180px) rotateZ(48deg) rotateY(0deg)', zIndex: 7
    },
    'romboide': {
      transform: 'translate3d(33px, 240px, 300px) rotateZ(-45deg) rotateY(0deg)', zIndex: 7
    },
    'cubo': {
      width: '100px', height: '100px', transform: 'translate3d(290px, 80px, 360px) rotateX(0deg) rotateY(0deg)', zIndex: 9
    }
  },

  

  //Paso Intermedio 2
  {
    'triangulo-grande-1': {
      transform: 'translate3d(26px, 400px, 200px) rotateZ(-180deg)', zIndex: 3
    },
    'triangulo-grande-2': {
      transform: 'translate3d(-335px, 85px, 230px) rotate(0deg) rotateZ(0deg)', zIndex: 4
    },
    'triangulo-mediano': {
      transform: 'translate3d(-90px, -132px, 145px) rotateX(-20deg) rotateY(0deg)', zIndex: 5
    },
    'triangulo-peque-1': {
      transform: 'translate3d(-200px, 727px, 280px) rotateX(0deg) rotateZ(-133deg) rotateY(0deg)', zIndex: 6
    },
    'triangulo-peque-2': {
      transform: 'translate3d(-67px, 440px, 180px) rotateZ(48deg) rotateY(0deg)', zIndex: 7
    },
    'romboide': {
      transform: 'translate3d(-175px, 233px, 300px) rotateZ(70deg) rotateY(0deg) rotateX(90deg)', zIndex: 7
    },
    'cubo': {
      width: '100px', height: '100px', transform: 'translate3d(26px, 9px, 360px) rotateX(1deg) rotateY(0deg)', zIndex: 9
    }
  },

  // Paso 2 (figura2)
  {
    'triangulo-grande-1': {
      transform: 'translate3d(26px, 400px, 200px) rotateZ(-180deg)', zIndex: 3
    },
    'triangulo-grande-2': {
      transform: 'translate3d(-335px, 85px, 200px) rotate(0deg) rotateZ(0deg)', zIndex: 4
    },
    'triangulo-mediano': {
      transform: 'translate3d(-90px, -140px, 235px) rotateX(-20deg) rotateY(0deg)', zIndex: 5
    },
    'triangulo-peque-1': {
      transform: 'translate3d(-260px, 641px, 220px) rotateX(0deg) rotateZ(-133deg) rotateY(0deg)', zIndex: 6
    },
    'triangulo-peque-2': {
      transform: 'translate3d(-120px, 356px, 220px) rotateZ(48deg) rotateY(0deg)', zIndex: 7
    },
    'romboide': {
      transform: 'translate3d(-175px, 233px, 270px) rotateZ(135deg) rotateY(0deg) rotateX(180deg)', zIndex: 7
    },
    'cubo': {
      width: '100px', height: '100px', transform: 'translate3d(26px, 9px, 240px) rotateX(1deg) rotateY(0deg)', zIndex: 9
    }
  
  },
 

  // Paso Intermedio 1 (figura2 a figura3)
  {
    
    'triangulo-grande-1': {
      transform: 'translate3d(26px, 400px, 230px) rotateZ(-180deg)', zIndex: 3
    },
    'triangulo-grande-2': {
      transform: 'translate3d(-335px, 85px, 115px) rotate(0deg) rotateZ(0deg)', zIndex: 4
    },
    'triangulo-mediano': {
      transform: 'translate3d(-300px, -140px, 280px) rotateX(-20deg) rotateY(0deg)', zIndex: 5
    },
    'triangulo-peque-1': {
      transform: 'translate3d(-260px, 635px, 180px) rotateX(0deg) rotateZ(-133deg) rotateY(0deg)', zIndex: 6
    },
    'triangulo-peque-2': {
      transform: 'translate3d(-120px, 356px, 300px) rotateZ(48deg) rotateY(0deg)', zIndex: 7
    },
    'romboide': {
      transform: 'translate3d(-175px, 233px, 380px) rotateZ(135deg) rotateY(20deg) rotateX(180deg)', zIndex: 7
    },
    'cubo': {
      width: '100px', height: '100px', transform: 'translate3d(26px, 9px, 200px) rotateX(1deg) rotateY(0deg)', zIndex: 9
    }
  
  },

  //Paso Intermedio 2 Figura 2 --> Figura 3
  {
    'triangulo-grande-1': {
      transform: 'translate3d(109px, 0px, 230px) rotateZ(-1deg)', zIndex: 3
    },
    'triangulo-grande-2': {
      transform: 'translate3d(-388px, 18px, 150px) rotate(0deg) rotateZ(0deg)', zIndex: 4
    },
    'triangulo-mediano': {
      transform: 'translate3d(25px, 533px, 280px) rotateX(20deg) rotateZ(179deg)', zIndex: 5
    },
    'triangulo-peque-1': {
      transform: 'translate3d(3px, 202px, 180px) rotateX(0deg) rotateZ(-45deg) rotateY(0deg)', zIndex: 6
    },
    'triangulo-peque-2': {
      transform: 'translate3d(128px, 378px, 300px) rotateZ(135deg) rotateY(0deg)', zIndex: 7
    },
    'romboide': {
      transform: 'translate3d(-175px, 233px, 380px) rotateZ(45deg) rotateY(180deg) rotateX(180deg)', zIndex: 7
    },
    'cubo': {
      width: '100px', height: '100px', transform: 'translate3d(26px, 195px, 200px) rotateX(1deg) rotateZ(45deg) rotateY(0deg)', zIndex: 9
    }
  },


  //Paso 3 Figura 3
  {
    'triangulo-grande-1': {
      transform: 'translate3d(109px, -2px, 215px) rotateZ(-1deg)', zIndex: 3
    },
    'triangulo-grande-2': {
      transform: 'translate3d(-388px, 18px, 180px) rotate(0deg) rotateZ(0deg)', zIndex: 4
    },
    'triangulo-mediano': {
      transform: 'translate3d(25px, 538px, 260px) rotateX(20deg) rotateZ(179deg)', zIndex: 5
    },
    'triangulo-peque-1': {
      transform: 'translate3d(3px, 202px, 220px) rotateX(0deg) rotateZ(-45deg) rotateY(0deg)', zIndex: 6
    },
    'triangulo-peque-2': {
      transform: 'translate3d(128px, 378px, 220px) rotateZ(135deg) rotateY(0deg)', zIndex: 7
    },
    'romboide': {
      transform: 'translate3d(-138px, 437px, 220px) rotateZ(45deg) rotateY(180deg) rotateX(180deg)', zIndex: 7
    },
    'cubo': {
      width: '100px', height: '100px', transform: 'translate3d(26px, 195px, 240px) rotateX(1deg) rotateZ(45deg) rotateY(0deg)', zIndex: 9
    }
  },

  {
    'triangulo-grande-1': {
      transform: 'translate3d(109px, -2px, 200px) rotateZ(-1deg)', zIndex: 3
    },
    'triangulo-grande-2': {
      transform: 'translate3d(-388px, 18px, 200px) rotate(0deg) rotateZ(0deg)', zIndex: 4
    },
    'triangulo-mediano': {
      transform: 'translate3d(25px, 545px, 265px) rotateX(20deg) rotateZ(179deg)', zIndex: 5
    },
    'triangulo-peque-1': {
      transform: 'translate3d(5px, 202px, 220px) rotateX(0deg) rotateZ(-45deg) rotateY(0deg)', zIndex: 6
    },
    'triangulo-peque-2': {
      transform: 'translate3d(128px, 378px, 220px) rotateZ(136deg) rotateY(0deg)', zIndex: 7
    },
    'romboide': {
      transform: 'translate3d(-138px, 437px, 220px) rotateZ(45deg) rotateY(180deg) rotateX(180deg)', zIndex: 7
    },
    'cubo': {
      width: '100px', height: '100px', transform: 'translate3d(26px, 195px, 240px) rotateX(1deg) rotateZ(45deg) rotateY(0deg)', zIndex: 9
    }
  },
];

const ComponenteTangram = () => {
  const [pasoActual, setPasoActual] = useState(0);
  const [direccion, setDireccion] = useState(1);

  const getTangramSpeed = () => {
    const speed = Number(localStorage.getItem('tangramSpeed'));
    console.log(`Tangram Speed: ${speed}ms`);
    return isNaN(speed) || speed <= 0 ? 400 : speed;
  };

  const tangramTransition = useMemo(() => {
    const speed = Number(localStorage.getItem('tangramSpeed'));
    const seconds = (isNaN(speed) || speed <= 0 ? 400 : speed) / 1000;
    console.log(`Transition Speed: ${seconds}s`);
    return `${seconds}s`;
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPasoActual(prevPaso => {
        const nextPaso = prevPaso + direccion;
        if (nextPaso >= pasos.length) {
          setDireccion(-1);
          return pasos.length - 1;
        } else if (nextPaso < 0) {
          setDireccion(1);
          return 0;
        }
        return nextPaso;
      });
    }, getTangramSpeed());

    return () => clearInterval(intervalId);
  }, [direccion]);

  const estilos = pasos[pasoActual] || pasos[0]; // Fallback to first step if invalid index

  return (
    <div className={styles.previewContainer}>
      <div 
        className={styles.tangramContainer} 
        style={{ '--tangram-transition': tangramTransition }}
      >
        <div className={`${styles.pieza} ${styles.trianguloGrande1}`} style={estilos['triangulo-grande-1']}>
          <TrianguloGrande_1 />
        </div>
        <div className={`${styles.pieza} ${styles.trianguloGrande2}`} style={estilos['triangulo-grande-2']}>
          <TrianguloGrande_2 />
        </div>
        <div className={`${styles.pieza} ${styles.trianguloMediano}`} style={estilos['triangulo-mediano']}>
          <TrianguloMediano />
        </div>
        <div className={`${styles.pieza} ${styles.trianguloPeque1}`} style={estilos['triangulo-peque-1']}>
          <TrianguloPeque_1 />
        </div>
        <div className={`${styles.pieza} ${styles.romboide}`} style={estilos['romboide']}>
          <Romboide />
        </div>
        <div className={`${styles.pieza} ${styles.trianguloPeque2}`} style={estilos['triangulo-peque-2']}>
          <TrianguloPeque_2 />
        </div>
        <div className={`${styles.pieza} ${styles.cubo}`} style={estilos['cubo']}>
          <Cubo />
        </div>
      </div>
    </div>
  );
};

export default ComponenteTangram;

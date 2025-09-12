<script setup>
import Cubo from './Tangram/Cubo.vue';
import TrianguloGrande_1 from './Tangram/TrianguloGrande_1.vue';
import TrianguloGrande_2 from './Tangram/TrianguloGrande_2.vue';
import TrianguloMediano from './Tangram/TrianguloMediano.vue';
import TrianguloPeque_1 from './Tangram/TrianguloPeque_1.vue';
import TrianguloPeque_2 from './Tangram/TrianguloPeque_2.vue';
import Romboide from './Tangram/Romboide.vue';
import { ref, computed } from 'vue';

// Definir los estilos de transform para cada paso
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
      transform: 'translate3d(-90px, -132px, 235px) rotateX(-20deg) rotateY(0deg)', zIndex: 5
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
      transform: 'translate3d(-300px, -132px, 280px) rotateX(-20deg) rotateY(0deg)', zIndex: 5
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
      transform: 'translate3d(25px, 533px, 235px) rotateX(20deg) rotateZ(179deg)', zIndex: 5
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


const pasoActual = ref(0);
let direccion = 1;


// Animación automática reversible
import { onMounted, onBeforeUnmount } from 'vue';

let intervalId = null;
function getTangramSpeed() {
  const speed = Number(localStorage.getItem('tangramSpeed'));
  console.log(`Tangram Speed: ${speed}ms`);
  return isNaN(speed) || speed <= 0 ? 400 : speed;
}

const tangramTransition = computed(() => {
  const speed = Number(localStorage.getItem('tangramSpeed'));
  const seconds = (isNaN(speed) || speed <= 0 ? 400 : speed) / 1000;
  console.log(`Transition Speed: ${seconds}s`);
  return `${seconds}s`;
});

onMounted(() => {
  intervalId = setInterval(() => {
    if (pasoActual.value === pasos.length - 1) {
      direccion = -1;
    } else if (pasoActual.value === 0) {
      direccion = 1;
    }
    pasoActual.value += direccion;
  }, getTangramSpeed());
});
onBeforeUnmount(() => {
  if (intervalId) clearInterval(intervalId);
});





const estilos = computed(() => pasos[pasoActual.value]);
</script>

<template>
  <div class="preview-container">
    <div class="tangram-container" :style="{ '--tangram-transition': tangramTransition }">
      <div class="pieza triangulo-grande-1" :style="estilos['triangulo-grande-1']"><TrianguloGrande_1 /></div>
      <div class="pieza triangulo-grande-2" :style="estilos['triangulo-grande-2']"><TrianguloGrande_2 /></div>
      <div class="pieza triangulo-mediano" :style="estilos['triangulo-mediano']"><TrianguloMediano /></div>
      <div class="pieza triangulo-peque-1" :style="estilos['triangulo-peque-1']"><TrianguloPeque_1 /></div>
      <div class="pieza romboide" :style="estilos['romboide']"><Romboide></Romboide></div>
      <div class="pieza triangulo-peque-2" :style="estilos['triangulo-peque-2']"><TrianguloPeque_2 /></div>
      <div class="pieza cubo" :style="estilos['cubo']"><Cubo /></div>
    </div>
  </div>
</template>

<style scoped>


.preview-container {
position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
  transform-style: preserve-3d;
  /* Aplica escala para loader */
  transform: scale(0.4) rotateY(40deg) translate3d(-70vh, -40vw, 0px);
}

body, html {
  overflow-y: auto;
}

.tangram-container {
  transition: transform  1s cubic-bezier(.77,0,.18,1);
  transform-style: preserve-3d;
  overflow: visible; /* importante */
}
.pieza {
  position: absolute;
  transform-style: preserve-3d;
  width: 100px;  /* Ajusta según tamaño real */
  height: 100px; /* Ajusta según tamaño real */
  box-sizing: border-box;
  border: 1px solid transparent; /* para debugging, pon rojo para probar */
  transition: transform var(--tangram-transition, 0.4s) cubic-bezier(.77,0,.18,1), z-index 1s;
}
/* Los transform y z-index ahora se manejan por binding en el template */
</style>

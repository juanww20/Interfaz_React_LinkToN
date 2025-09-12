<template>
  <div
    class="triangle-prism"
    @mousedown="startDrag"
    @mousemove="onDrag"
    @mouseup="endDrag"
    @mouseleave="endDrag"
    :style="transformStyle"
  >
    <div class="face front"></div>
    <div class="face back"></div>
    <div class="face bottom"></div>
    <div class="face left"></div>
    <div class="face right"></div>
  </div>
</template>

<script>
export default {
  name: 'TrianglePrism3DClip',
  data() {
    return {
      rotateX:  0,
      rotateY: 0,
      isDragging: false,
      lastMouseX: 0,
      lastMouseY: 0
    };
  },
  computed: {
    transformStyle() {
      return {
        transform: `rotateX(${this.rotateX}deg) rotateY(${this.rotateY}deg)`,
        transformStyle: 'preserve-3d',
        width: '100px',
        height: '100px',
        position: 'relative',
        margin: '100px auto',
        cursor: this.isDragging ? 'grabbing' : 'grab'
      };
    }
  },
    
};
</script>

<style scoped>
.triangle-prism {
  position: relative;
  width: 140px; /* reducido */
  height: 60px; /* reducido */
  margin: 100px auto;
  transition: transform 0.1s ease-out;
  perspective: 800px;
}

.face {
  position: absolute;
  opacity: 0.95;
}

/* Triángulo frontal */
.face.front {
  width: 141px;
  height: 75px;
  background-color: #96a4a7;
  clip-path: polygon(45% 0%, 0% 100%, 102% 100%);
  transform: translateZ(30px) translateY(18px);
}

/* Triángulo trasero */
.face.back {
  width: 141px;
  height: 76px;
  background-color: #96a4a7;
  clip-path: polygon(55% 0%, 0% 100%, 102% 100%);
  transform: rotateY(180deg) translateY(18px) translateZ(-18px);
}

/* Cara inferior */
.face.bottom {
  width: 140px;
  height: 12px;
  background-color: #72797a;
  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
  transform: rotateX(96deg) rotateY(-0deg) translateY(8px) translateZ(-96px);
  transform-origin: top;
}

/* Cara lateral izquierda */

/* Cara lateral izquierda */
.face.left {
  width: 30px;
  height: 140px;
  background-color: #72797a;
  clip-path: polygon(0% 0%, 40% 0%, 41% 70%, 0% 70%);
  transform: rotateY(90deg) translateY(-15px) rotateX(-41deg) translateX(-30px) translateZ(24px);
  transform-origin: left;
}

/* Cara lateral derecha */
.face.right {
  width: 30px;
  height: 110px;
  background-color: #72797a;
  clip-path: polygon(60% 0%, 100% 0%, 100% 100%, 59% 100%);
  transform: rotateY(90deg)  rotateX(47deg) translateY(55px) translateX(-18px) translateZ(50px);
  transform-origin: right;
}
</style>

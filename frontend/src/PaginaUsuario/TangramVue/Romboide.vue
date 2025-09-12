<template>
  <div class="romboide-container"
       @mousedown="startDrag"
       @mousemove="onDrag"
       @mouseup="endDrag"
       @mouseleave="endDrag"
       :style="transformStyle"
  >
    <!-- Prisma 1 -->
    <div class="triangle-prism">
      <div class="face front"></div>
      <div class="face back"></div>
      <div class="face bottom"></div>
      <div class="face left"></div>
    </div>

    <!-- Prisma 2 (rotado y desplazado) -->
    <div class="triangle-prism flipped">
      <div class="face front"></div>
      <div class="face back"></div>
      <div class="face bottom"></div>
      <div class="face left"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Romboide3D',
  data() {
    return {
      rotateX: 0,
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
        cursor: this.isDragging ? 'grabbing' : 'grab'
      };
    }
  },
  
  
};
</script>

<style scoped>
.romboide-container {
  width: fit-content;
  margin: 100px auto;
  perspective: 800px;
  position: relative;
}

.triangle-prism {
  position: absolute;
  width: 120px;
  height: 60px;
  transform-style: preserve-3d;
  transition: transform 0.1s ease-out;
}

.triangle-prism.flipped {
  transform: translateY(36.5px) translateX(59px) rotateY(180deg) rotateX(180deg) translateZ(0px);
}

/* Caras del prisma */
.face {
  position: absolute;
  opacity: 0.95;
}

/* Triángulo frontal */
.face.front {
  width: 120px;
  height: 60px;
  background-color: #cab70b;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  transform: translateZ(30px) translateY(18px);
}

/* Triángulo trasero */
.face.back {
  width: 120px;
  height: 60px;
  background-color: #cab70b;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  transform: rotateY(180deg) translateY(18px) translateZ(-18px);
}

/* Cara inferior */
.face.bottom {
  width: 120px;
  height: 12px;
  background-color: #a19208;
  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
  transform: rotateX(90deg) translateY(18px) translateZ(-78px);
  transform-origin: top;
}

/* Cara lateral izquierda */
.face.left {
  width: 30px;
  height: 120px;
  background-color: #a19208;
  clip-path: polygon(0% 0%, 40% 0%, 41% 70%, 0% 70%);
  transform: rotateY(90deg) translateY(-17px) rotateX(-45deg) translateX(-30px) translateZ(25px);
  transform-origin: left;
}

/* Cara lateral derecha */
.face.right {
  width: 30px;
  height: 97px;
  background-color: #a19208;
  clip-path: polygon(0% 0%, 40% 0%, 40% 90%, 0% 90%);
  transform: rotateY(90deg) translateY(67px) rotateX(45deg) translateX(0px) translateZ(90px);
  transform-origin: right;
}
</style>

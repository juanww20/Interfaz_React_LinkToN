<template>
  <div class="cube-container"
       @mousedown="startDrag"
       @mousemove="onDrag"
       @mouseup="endDrag"
       @mouseleave="endDrag"
       :style="transformStyle"
  >
    <div class="face front"></div>
    <div class="face back"></div>
    <div class="face right"></div>
    <div class="face left"></div>
    <div class="face top"></div>
    <div class="face bottom"></div>
  </div>
</template>

<script>
export default {
  name: 'CubeShallow',
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
.cube-container {
  perspective: 800px;
  transform-style: preserve-3d;
  transition: transform 0.1s ease-out;
  

}

.face {
  position: absolute;
  width: 100px;
  height: 100px;
  background-color: #11d811d9;
}

/* Profundidad ajustada: solo 36px → ±18px desde el centro */
.face.front {
  transform: translateZ(18px);
}
.face.back {
  transform: rotateY(180deg) translateZ(18px);
}
.face.right {
  width: 36px;
  transform: rotateY(90deg) translateZ(82px);
  background-color: #0da00dd9;
}
.face.left {
  background-color: #0da00dd9;
  width: 36px;
  transform: rotateY(-90deg) translateZ(18px);
}
.face.top { 
    background-color: #0da00dd9;
    height: 36px;
  transform: rotateX(90deg) translateZ(18px);
}
.face.bottom {
      background-color: #0da00dd9;

        height: 36px;

  transform: rotateX(-90deg) translateZ(82px);
}
</style>

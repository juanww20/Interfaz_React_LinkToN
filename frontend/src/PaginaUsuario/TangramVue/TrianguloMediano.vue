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
      rotateX: 20,
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
  width: 200px;
  height: 100px;
  margin: 100px auto;
  perspective: 800px;
  transition: transform 0.1s ease-out;
  transform-style: preserve-3d;
  cursor: grab;
}

.face {
  position: absolute;
  opacity: 0.95;
}

/* Triángulo frontal */
.face.front {
  width: 205px;
  height: 110px;
  background-color: #ae00ff;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  transform: translateZ(50px) translateY(30px);
}

/* Triángulo trasero */
.face.back {
  width: 205px;
  height: 110px;
  background-color: #ae00ff;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  transform: rotateY(180deg) translateY(30px) translateZ(-39px);
}

/* Cara inferior */
.face.bottom {
  width: 205px;
  height: 10px;
  background-color: #7a02b3;
  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
  transform: rotateX(90deg) translateY(40px) translateZ(-140px);
  transform-origin: top;
}

/* Cara lateral izquierda */
.face.left {
  width: 30px;
  height: 215px;
  background-color: #7a02b3;
  clip-path: polygon(0% 0%, 40% 0%, 41% 70%, 0% 70%);
  transform: rotateY(90deg) translateY(-26px) rotateX(-43deg) translateX(-50px) translateZ(40px);
  transform-origin: left;
}

/* Cara lateral derecha */
.face.right {
  width: 30px;
  height: 168px;
  background-color: #7a02b3;
  clip-path: polygon(0% 0%, 40% 0%, 40% 90%, 0% 90%);
  transform: rotateY(90deg) translateY(125px) rotateX(43deg) translateX(-20px) translateZ(175px);

  transform-origin: right;
}
</style>

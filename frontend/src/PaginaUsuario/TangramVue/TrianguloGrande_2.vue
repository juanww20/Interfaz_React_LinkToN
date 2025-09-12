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
  width: 290px;
  height: 148px;
  background-color: #e20a9a;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  transform: translateZ(50px) translateY(30px);
}

/* Triángulo trasero */
.face.back {
  width: 290px;
  height: 148px;
  background-color: #e20a9a;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  transform: rotateY(180deg) translateY(30px) translateZ(-30px);
}


/* Cara inferior */
.face.bottom {
  width: 290px;
  height: 20px;
  background-color: #a50b72;
  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
  transform: rotateX(90deg) translateY(30px) translateZ(-177px);
  transform-origin: top;
}

/* Cara lateral izquierda */
.face.left {
  width: 50px;
  height: 300px;
  background-color: #a50b72;
  clip-path: polygon(0% 0%, 40% 0%, 41% 70%, 0% 70%);
  transform: rotateY(90deg) translateY(-53px) rotateX(-44.5deg) translateX(-50px) translateZ(56px);
  transform-origin: left;
}

/* Cara lateral derecha */
.face.right {
  width: 50px;
  height: 235px;
  background-color: #a50b72;
  clip-path: polygon(0% 0%, 40% 0%, 40% 90%, 0% 90%);
  transform: rotateY(90deg) translateY(168px) rotateX(44.5deg) translateX(0px) translateZ(247px);

  transform-origin: right;
}
</style>

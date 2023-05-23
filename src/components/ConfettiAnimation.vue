<template>
  <div class="confetti-container">
    <canvas id="my-canvas"></canvas>
  </div>
</template>

<script>
import ConfettiGenerator from "confetti-js";
import { onMounted } from "vue";

export default {
  name: "ConfettiAnimation",
  setup() {

    const startConfettiAnimation = () => {
      const confettiSettings = {
        target: "my-canvas",
        max: "190",
        size: "1.5",
        animate: true,
        "props": [
            "circle",
            "square",
            { "type": "svg", "src": "https://www.svgrepo.com/show/444861/star.svg" }
        ],
        colors: [
          [165, 104, 246],
          [230, 61, 135],
          [0, 199, 228],
          [253, 214, 126],
        ],
        clock: "25",
        rotate: true,
        width: "1360",
        height: "663",
        start_from_edge: true,
        respawn: true,
      };
      
      const confetti = new ConfettiGenerator(confettiSettings);
      confetti.render();

      setTimeout(() => {
        confetti.clear();
      }, 5000); // Duración de la animación en milisegundos
    };

    onMounted(() => {
      startConfettiAnimation();
    });
  },
};
</script>

<style scoped>
.confetti-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  pointer-events: none;
}

canvas {
  width: 100%;
  height: 100%;
}
</style>

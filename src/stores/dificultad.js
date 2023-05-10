import { reactive } from "vue";
// SIBLING COMUNNICATION VIA STORE https://tallpad.com/series/vuejs-misc/lessons/component-communication-in-vue3-sibling-parent-and-child-components

export const dificultad = reactive({
  // dificultadActual: reactive({ "nivel": "Facil", "filas": 5, "columnas": 5 }),
  dificultadActual: { },
  setearDificultad(objDificultad) {
    this.dificultadActual = objDificultad;
  },
});

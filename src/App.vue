<template>
  <h1>Buscaminas</h1>
  <Dificultades/>
  <Tablero />
</template>

<script>
import Tablero from './components/Tablero.vue';
import Dificultades from './components/Dificultades.vue';

export default {
  name: 'App',
  components: { Tablero, Dificultades },
  setup() {}
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
}

html{
    box-sizing: border-box;
    font-family: sans-serif;
}

*, *:before, *:after {
    box-sizing: inherit;
}

body {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 5vh;
}

</style>

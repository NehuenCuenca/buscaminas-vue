<template>
  <header class="header">
    <h1 class="header__titulo">Buscaminas</h1>
    <Dificultades/>
  </header>
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
:root {
	--display-font: Tahoma;
	--default-font: sans-serif, Arial;
	--black: #000000;
	--white: #FFFFFF;

	--blue-ocean-dark: #2c3e50;

	color: var(--white);
	background-color: var(--blue-ocean-dark);
}

/* RESETS */
*, *::before, *::after {
	box-sizing: border-box;
}

* {
	margin: 0;
}

body {
	line-height: 1.5;
	-webkit-font-smoothing: antialiased;
	width: 100%;
	padding: 5vh 0 10vh 0;
}

img, picture, video, canvas, svg {
	display: block;
	max-width: 100%;
}

p {
	overflow-wrap: break-word;
}

a { 
	color:inherit;
	text-decoration: none;
}

button{
	background-color: transparent;
	border: none;
	cursor: pointer;
}

ul,ol { 
	list-style-type: none;
	padding: 0
}

html {
	font: normal normal 400 1.2rem var(--default-font);
	width: 100%;
	scroll-behavior: smooth;
}

header {
	width: 100%;
}

section {
	scroll-margin-block-start: 120px; /*Adds margin to the top of the viewport*/
	scroll-margin-block-end: 120px; /*Adds margin to the bottom of the viewport*/
}


#app {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 2vh;
}

.header{
	padding: 0 2rem;
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
}
.header__titulo{
    font: normal normal 600 2.2rem var(--display-font);
}
</style>

<template>
    <ul class="lista-niveles">
        <li v-for="(nivel, index) in Object.keys(dificultades)" :key="index" class="lista-niveles__item-nivel"> 
            <button @click="elegirNivel(nivel)" class="boton-nivel" 
            :class="(dificultad.dificultadActual.nivel === nivel) ? 'boton-nivel_seleccionado' : ''">{{ nivel }}</button>
        </li>
    </ul>
</template>

<script>
import { onMounted, ref } from 'vue';
import { dificultad } from "../stores/dificultad.js"
export default {
    name: 'Dificultades',

    setup () {
        const dificultades = ref({
            /* 'test': {
                filas: 3,
                columnas: 3,
                cantBombas: 2
            }, */
            'Facil': {
                filas: 8,
                columnas: 8,
                cantBombas: Math.floor( ((8*8) * 0.16) )
            },
            'Medio': {
                filas: 10,
                columnas: 22,
                cantBombas: Math.floor( ((10*22) * 0.16) ),
            },
            'Dificil': {
                filas: 16,
                columnas: 30,
                cantBombas: Math.floor( ((16*30) * 0.21) )
            }
        })
        
        const elegirNivel = (nivel) => { 
            if( nivel === dificultad.dificultadActual.nivel ) return
            dificultad.setearDificultad({nivel, ...dificultades.value[nivel]})             
        }

        onMounted(() => {
            const [ facil ] = Object.keys(dificultades.value)
            elegirNivel(facil)
        })

        return {
            dificultades,
            elegirNivel,
            dificultad
        }   
    }
}
</script>

<style scoped>

.lista-niveles{
    display: flex;
    gap: 1rem;
}
/* .lista-niveles__item-nivel{} */
.boton-nivel{
    font: normal normal 400 1.1rem var(--default-font);
    color: var(--blue-ocean-dark);
    background-color: var(--white);
    text-transform: capitalize;
    padding: .3rem .5rem;
    border-radius: .5rem;
    border: none;
}

.boton-nivel_seleccionado {
    background-color: darkcyan;
    color: var(--white);
    text-shadow: 2px 0 #2c3e50, -2px 0 #2c3e50, 0 2px #2c3e50, 0 -2px #2c3e50,
               1px 1px #2c3e50, -1px -1px #2c3e50, 1px -1px #2c3e50, -1px 1px #2c3e50;
}
</style>
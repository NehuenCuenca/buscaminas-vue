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
                filas: 5,
                columnas: 5,
                cantBombas: 2
            }, */
            'Facil': {
                filas: 8,
                columnas: 8,
                cantBombas: Math.floor( ((8*8) * 0.16) )
            },
            'Medio': {
                filas: 16,
                columnas: 16,
                cantBombas: Math.floor( ((16*16) * 0.16) )
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
            centrarVistaAlTablero()
             
        }

        const centrarVistaAlTablero = () => { 
            const tablero = document.querySelector("#juego-tablero");
            tablero.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
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
    text-transform: uppercase;
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
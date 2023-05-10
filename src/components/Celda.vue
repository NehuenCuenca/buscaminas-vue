<template>
    <div @click="mostrarCelda" 
        @click.right.prevent="colocarBandera" 
        class="celda" :class="(visible) ? 'descubierta': ''">
       {{ valorCelda }} 
    </div>
</template>

<script>
import { computed, toRefs, watch } from 'vue';

    export default {
        name: 'Celda',
        props: ['celda'],
        setup( props, {emit} ) {
            const { id, fila, columna, visible, tieneBomba, bandera, valor } = toRefs(props.celda)

            const valorCelda = computed(() => {
                let valorLocal
                if( !visible.value && bandera.value ){ valorLocal = '🚩' } 
                if( visible.value ){ 
                    valorLocal = (tieneBomba.value) ?  '💣' : valor.value
                } 

                return valorLocal
            })

            const colocarBandera = () => { 
                bandera.value = !bandera.value
            }

            const mostrarCelda = () => {
                if( visible.value ) return
                visible.value = true
                emit('manejarCelda', props.celda)
            }

            return {
                id, fila, columna,
                visible,
                tieneBomba,
                mostrarCelda,
                colocarBandera,
                valorCelda
            }
        }
    }
</script>

<style scoped>
.celda {
    cursor: pointer;
    border: 2px solid black;
    background-color: grey;
    height: 35px;
    width: 45px;
    /* padding: .2rem; */
    display: flex;
    justify-content: center;
    align-items: center;
    color: black;
    font-size: 1.2rem;
    font-weight: bold;
}
.celda span {
    font-size: 10px;
}

.descubierta {
 background-color: gainsboro;
}
</style>
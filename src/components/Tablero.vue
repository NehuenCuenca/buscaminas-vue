<template>
    <div>
        <h3>Tablero</h3>
        <p>{{ dificultad.dificultadActual }}</p>
        <div v-if="tablero" class="tablero">
            <div v-for="(fila, indexFila) in tablero" :key="indexFila" class="fila">
                <Celda v-for="(celda, indexCelda) in fila" :key="indexCelda" :celda="celda" class="columna"
                    @manejarCelda="manejarCelda" />
            </div>
        </div>
    </div>
</template>

<script>
import { nextTick, onMounted, ref, watch } from "vue";
import { dificultad } from "../stores/dificultad.js";
import Celda from "../components/Celda.vue";

export default {
    name: "Tablero",
    components: { Celda },
    setup() {
        const tablero = ref([]);
        const cantBanderas = ref(0);

        const generarTablero = () => {
            const { filas, columnas, cantBombas } = dificultad.dificultadActual;
            tablero.value = [];
            let contador = 1;

            nextTick(() => {
                tablero.value = Array.from({ length: filas }).map((fila, i) => {
                    return Array.from({ length: columnas }, (v, j) => {
                        contador++;
                        const tieneBomba =  Math.floor(Math.random() * 10) >= 8.5;
                        return {
                            id: contador - 1,
                            fila: i,
                            columna: j,
                            bandera: false,
                            tieneBomba,
                            visible: false,
                            valor: tieneBomba ? "💣" : "",
                        };
                    });
                });
            });
        };

        const manejarCelda = (celda) => {
            // Si clickeo una bomba...
            // Sino..
            // Si es el primer click (solo hay una celda visible)...
            // Si clickeo una celda vecina o SIN BOMBA...
            if (celda.tieneBomba) {
                console.log("PERDISTEEEEE");
                return;
            }

            const cantBombasVecinas = contarBombasVecinas(celda);
            celda.valor = cantBombasVecinas > 0 ? cantBombasVecinas : "";
            if (!celda.visible) { celda.visible = !celda.visible; }

            if (cantBombasVecinas === 0) {
                const celdasVecinas = mapearCeldasVecinas(celda);
                for (let i = 0; i < celdasVecinas.length; i++) {
                    const celdaVecina = celdasVecinas[i];
                    manejarCelda(celdaVecina);
                }
            }
        };

        const contarBombasVecinas = (celda) => {
            let contador = 0;
            const { filas, columnas } = dificultad.dificultadActual;

            for (
                let i = Math.max(celda.fila - 1, 0);
                i <= Math.min(celda.fila + 1, filas - 1);
                i++
            ) {
                for (
                    let j = Math.max(celda.columna - 1, 0);
                    j <= Math.min(celda.columna + 1, columnas - 1);
                    j++
                ) {
                    // Ignorar la celda actual
                    if (i === celda.fila && j === celda.columna) continue;
                    // Si la celda vecina tiene una bomba, retornar true
                    if (tablero.value[i][j].tieneBomba) {
                        contador++;
                    }
                }
            }

            return contador;
        };

        const mapearCeldasVecinas = (celda) => {
            const { filas, columnas } = dificultad.dificultadActual;
            const celdasVecinasSinBombas = [];

            for (
                let i = Math.max(celda.fila - 1, 0);
                i <= Math.min(celda.fila + 1, filas - 1);
                i++
            ) {
                for (
                    let j = Math.max(celda.columna - 1, 0);
                    j <= Math.min(celda.columna + 1, columnas - 1);
                    j++
                ) {
                    // Ignorar la celda actual
                    if (i === celda.fila && j === celda.columna) continue;
                    if (!tablero.value[i][j].tieneBomba && !tablero.value[i][j].visible) {
                        celdasVecinasSinBombas.push(tablero.value[i][j]);
                    }
                }
            }
            return celdasVecinasSinBombas;
        };

        watch(dificultad, () => {
            const { cantBombas } = dificultad.dificultadActual
            cantBanderas.value = cantBombas
            generarTablero();
        });

        onMounted(() => {
            generarTablero();
        });

        return {
            dificultad,
            tablero,
            manejarCelda,
            cantBanderas
        };
    },
};
</script>

<style scoped>
.tablero {
    width: 70vw;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    row-gap: 2px;
}

.fila {
    display: flex;
    width: 70vw;
    column-gap: 2px;
    justify-content: center;
    align-items: center;
}
</style>

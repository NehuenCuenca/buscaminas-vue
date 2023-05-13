<template>
    <div class="component">
        <div id="info-tablero">
            <span>{{ cantBanderas }} 🚩</span>
            <button id="btn-reiniciar" @click="empezarJuego">{{ emojiJuego }}</button>
            <span id="cronometro">{{ timerTablero }}''⏱</span>
        </div>
        
        
        <div v-if="tablero" class="tablero" :class=" terminoJuego ? 'intocable' : ''">
            <div v-for="(fila, indexFila) in tablero" :key="indexFila" class="fila">
                <Celda v-for="(celda, indexCelda) in fila" :key="indexCelda" :celda="celda" class="columna"
                    @manejarCelda="manejarCelda" @manejarBandera="manejarBandera" @mousedown="() => emojiJuego = '🤨'" @mouseup="() => emojiJuego = '🙂'"/>
            </div>
        </div>
    </div>
</template>

<script>
import { nextTick, ref, watch } from "vue";
import { dificultad } from "../stores/dificultad.js";
import Celda from "../components/Celda.vue";

export default {
    name: "Tablero",
    components: { Celda },
    setup() {
        //VARS
        const tablero = ref([]);
        const cantBanderas = ref(0);
        const terminoJuego = ref(false);
        const emojiJuego = ref('🙂');

        const timerTablero = ref(0);
        const timerWindow = ref(null);

        // Funciones
        const empezarTimer = () => { timerWindow.value = setInterval(() => { timerTablero.value++;}, 1000); }   
        const pararTimer = () => { clearInterval(timerWindow.value) }

        const generarTablero = () => {
            const { filas, columnas } = dificultad.dificultadActual;
            tablero.value = [];
            let contadorCeldas = 0;

            nextTick(() => {
                tablero.value = Array.from({ length: filas }).map((fila, i) => {
                    return Array.from({ length: columnas }, (v, j) => {
                        contadorCeldas++;

                        return {
                            id: contadorCeldas - 1,
                            fila: i,
                            columna: j,
                            bandera: false,
                            tieneBomba: false,
                            visible: false,
                            valor: "",
                        };
                    });
                });
                
                colocarBombasAleatoriamente();
            });
        };

        const colocarBombasAleatoriamente = () => {
            const { cantBombas } = dificultad.dificultadActual;
            let contadorBombas = 0;

            while (contadorBombas < cantBombas) {
                const celdasSinBomba = tablero.value.flat().filter(({ tieneBomba }) => !tieneBomba);
                const indiceRandom = Math.floor(Math.random() * celdasSinBomba.length);

                const celdaRandom = celdasSinBomba[indiceRandom];
                celdaRandom.tieneBomba = !celdaRandom.tieneBomba;
                celdaRandom.valor = "💣";

                contadorBombas++;
            }
        };

        const manejarBandera = (celda, toggler) => {
            const { cantBombas } = dificultad.dificultadActual;
            if (cantBanderas.value === 0 && celda.bandera) {
                celda.bandera = !celda.bandera;
                return;
            }

            toggler && cantBanderas.value > 0 && cantBanderas.value <= cantBombas
                ? cantBanderas.value--
                : cantBanderas.value++;

            checkearVictoria();
        };

        const manejarCelda = (celda) => {
            const primerJugada = !tablero.value.flat().some(({ visible, id }) => visible && id != celda.id);
            // Si clickeo una bomba en la primer jugada...
            if (primerJugada) {
                empezarTimer()
                // buscar una celda sin bomba, sin que sea la misma celda
                nextTick(() => {
                    moverBombasCercanas(celda);

                    const celdasVecinas = mapearCeldasVecinas(celda);
                    celdasVecinas.forEach((vecina) => { vecina.tieneBomba = false; });

                    descubrirCeldas(celda);
                });
            } else {
                // Si clickeo una BOMBA...
                if (celda.tieneBomba) {
                    alert("🤯 HAS PISADO UNA BOMBITA 🤯");
                    terminoJuego.value = true;
                    emojiJuego.value = '💀'
                    pararTimer()
                    return descubrirBombas(celda);
                }

                // Si clickeo una celda vecina o SIN BOMBA...
                descubrirCeldas(celda);
            }

            checkearVictoria();
        };

        const checkearVictoria = () => {
            const tableroUnidimensional = tablero.value.flat();
            const bombasTienenBandera = tableroUnidimensional
                .filter(({ tieneBomba }) => tieneBomba)
                .every((c) => c.bandera && !c.visible);

            const hayCeldasCubiertas = tableroUnidimensional.some(
                ({ visible, bandera }) => !visible && !bandera
            );
            const gano = bombasTienenBandera && !hayCeldasCubiertas;
            if (gano) {
                pararTimer()
                console.log("GANASTEEE");
                alert("GANASTEEE");
                terminoJuego.value = true;
                emojiJuego.value = '😎'
            }
        };

        const empezarJuego = () => { 
            const { cantBombas } = dificultad.dificultadActual;
            terminoJuego.value = false;
            emojiJuego.value = '🙂'
            cantBanderas.value = cantBombas;            
            generarTablero();
        }

        const descubrirBombas = (bombaClickeada) => {
            tablero.value.flat()
                .filter(({ tieneBomba, id }) => tieneBomba && id != bombaClickeada.id )
                .forEach((celda) => {
                    celda.visible = true;
                });
        };

        const moverBombasCercanas = (celda) => {
            const bombasCercanas = mapearCeldasVecinas(celda).filter(({ tieneBomba }) => tieneBomba);
            if (celda.tieneBomba) { bombasCercanas.push(celda); }

            bombasCercanas.forEach((celdaConBomba) => {
                const celdaRandom = buscarCeldaSinBomba(celda);
                celdaRandom.tieneBomba = !celdaRandom.tieneBomba;
                celdaConBomba.tieneBomba = !celdaConBomba.tieneBomba;
            });
            // console.log(tablero.value.flat().filter(({ tieneBomba }) => tieneBomba));
            return;
        };

        const buscarCeldaSinBomba = (celda) => {
            const nueveCeldas = [
                celda.id,
                ...mapearCeldasVecinas(celda).map(({ id }) => id),
            ];

            const celdasSinBomba = tablero.value
                .flat()
                .filter(
                    ({ tieneBomba, id }) => !tieneBomba && !nueveCeldas.includes(id)
                );

            const indiceRandom = Math.floor(Math.random() * celdasSinBomba.length);

            return celdasSinBomba[indiceRandom];
        };

        const descubrirCeldas = (celda) => {
            const cantBombasVecinas = contarBombasVecinas(celda);
            celda.valor = cantBombasVecinas > 0 ? cantBombasVecinas : "";
            if (!celda.visible) { celda.visible = !celda.visible; }

            if (cantBombasVecinas === 0) {
                const celdasVecinas = mapearCeldasVecinas(celda).filter(
                    ({ tieneBomba, visible, bandera }) =>
                        !tieneBomba && !visible && !bandera
                );
                for (let i = 0; i < celdasVecinas.length; i++) {
                    const celdaVecina = celdasVecinas[i];
                    descubrirCeldas(celdaVecina);
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
            const celdasVecinas = [];

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
                    celdasVecinas.push(tablero.value[i][j]);
                }
            }
            return celdasVecinas;
        };

        watch(dificultad, () => { empezarJuego() });
        watch(timerTablero, () => { if( timerTablero.value === 999 ){ pararTimer() } });

        return {
            dificultad,
            tablero,
            timerTablero,
            emojiJuego,
            cantBanderas,
            manejarCelda,
            manejarBandera,
            terminoJuego,
            empezarJuego,
        };
    },
};
</script>

<style scoped>

.component {
    width: 70%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    row-gap: 4vh;
}

#info-tablero{
    font-size: 1.3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 5vw;
    user-select: none;
}

#btn-reiniciar{
    font-size: inherit;
    width: auto;
    height: auto;
    background: none;
    border: 1px solid grey;
    padding: .3rem;
    cursor:pointer; 
    user-select: unset;
}

.tablero {
    width: 70vw;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    row-gap: 2px;
}

.intocable{
    pointer-events: none;
}


.fila {
    display: flex;
    width: 70vw;
    column-gap: 2px;
    justify-content: center;
    align-items: center;
}


</style>

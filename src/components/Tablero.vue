<template>
    <div class="tablero-container">
        <template v-if="emojiJuego === '😎' && terminoJuego">  
            <ConfettiAnimation  />  
            <TiemposPorNivel :dificultad="dificultad.dificultadActual"/>
        </template>

        <div class="info-tablero">
            <span class="info-tablero__cant-banderas">{{ cantBanderas }} 🚩</span>
            <button class="info-tablero__btn-reiniciar" @click="empezarJuego">{{ emojiJuego }}</button>
            <span class="info-tablero__cronometro">{{ timerTablero }}''⏱</span>
        </div>
        
        <div v-if="tablero" class="tablero-container__tablero" :class=" terminoJuego ? 'tablero-container__tablero_intocable' : ''">
            <div v-for="(fila, indexFila) in tablero" :key="indexFila" class="fila">
                <Celda v-for="(celda, indexCelda) in fila" :key="indexCelda"  
                    :celda="celda" @contextmenu="() => false"
                    @manejarCelda="manejarCelda" @manejarBandera="manejarBandera" 
                    @mousedown="() => emojiJuego = '🤨'" @mouseup="() => emojiJuego = '🙂'"
                    />
            </div>
        </div>

        <InfoNivelActual />
    </div>
</template>

<script>
import { nextTick, ref, watch } from "vue";
import { dificultad } from "../stores/dificultad.js";
import Celda from "../components/Celda.vue";
import TiemposPorNivel from "../components/TiemposPorNivel.vue";
import ConfettiAnimation from "../components/ConfettiAnimation.vue";
import InfoNivelActual from "./InfoNivelActual.vue";

export default {
    name: "Tablero",
    components: { Celda, ConfettiAnimation, TiemposPorNivel, InfoNivelActual },
    setup() {
        //VARS
        const tablero = ref([]);
        const cantBanderas = ref(0);
        const terminoJuego = ref(false);
        const emojiJuego = ref('🙂');

        const timerTablero = ref(0);
        const timerWindow  = ref(null);

        // Funciones
        const empezarTimer = () => { timerWindow.value = setInterval(() => { timerTablero.value++;}, 1000); }   
        const pararTimer = () => { clearInterval(timerWindow.value) }

        const generarTablero = () => {
            const { filas, columnas } = dificultad.dificultadActual;
            let contadorCeldas = 0;
            tablero.value = [];
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
                            explotar: false
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
                return nextTick(() => {
                    moverBombasCercanas(celda);

                    const celdasVecinas = mapearCeldasVecinas(celda);
                    celdasVecinas.forEach((vecina) => { vecina.tieneBomba = false; });

                    descubrirCeldas(celda);
                });
            } else {
                // Si clickeo una BOMBA...
                if (celda.tieneBomba) { return pisoBomba(celda) }

                //Si clickea un NUMERO con banderas vecinas (la cant de banderas debe ser igual o mayor al numero clickeado)
                const tieneBanderasNecesarias = mapearCeldasVecinas(celda).filter(({ bandera }) => bandera).length >= celda.valor
                const clickAcorde = celda.valor != '' && celda.visible && tieneBanderasNecesarias
                if (clickAcorde) { return acordeCeldas(celda) }

                // Descartadas las otras opciones, si clickea una celda ya descubierta...
                if( celda.valor != '' && celda.visible ){ return } 

                // Si clickeo una celda vecina o SIN BOMBA...
                descubrirCeldas(celda);
            }
        };

        const pisoBomba = (celda) => { 
            if(!terminoJuego.value){
                celda.explotar = true   
                alert("🤯 HAS PISADO UNA BOMBITA 🤯");
                terminoJuego.value = true;
                emojiJuego.value = '💀'
                pararTimer()
                return descubrirBombas(celda);
            }
        }

        const checkearVictoria = () => {
            const { cantBombas } = dificultad.dificultadActual
            const tableroUnidimensional = tablero.value.flat();

            const bombasTienenBandera = tableroUnidimensional
            .filter(({ tieneBomba }) => tieneBomba)
            .every((c) => c.bandera && !c.visible);

            if(!bombasTienenBandera){ return }
                            
            const cantCeldasAbiertas = tableroUnidimensional.filter(
            ({ visible, bandera }) => visible && !bandera).length ;
            const cantCeldasSinBombas = tableroUnidimensional.length-cantBombas
            const todasLasCeldasAbiertas = cantCeldasAbiertas === cantCeldasSinBombas
            
            const gano = bombasTienenBandera && todasLasCeldasAbiertas;
                    
            if (gano) {
                pararTimer();
                alert("🤓GANASTEEE🤓");
                terminoJuego.value = true;
                emojiJuego.value = '😎'
                guardarTiempo({ timer: timerTablero.value, fecha: Date.now()})
            }
        };

        const guardarTiempo = ({timer, fecha}) => { 
            const tiempos = JSON.parse(localStorage.getItem('tiemposPorNivel')) || {};
            const { nivel } = dificultad.dificultadActual;
            
            //Si el timer actual es inferior a los 3 timers ya realizados, retornarmos..
            if(tiempos[nivel]?.length === 3 && tiempos[nivel]?.every(viejo => viejo.timer < timer)){ return }
            
            // En caso contrario, guardamos el timer realizado
            const hayTiemposViejos = (tiempos[nivel]?.length > 0) ? tiempos[nivel] : [];
            const todosLosTiempos = { 
                ...tiempos, 
                [nivel]: [ ...hayTiemposViejos, {timer, fecha}].sort((a,b) => a.timer - b.timer).slice(0, 3)
            }

            localStorage.setItem('tiemposPorNivel', JSON.stringify(todosLosTiempos));
        }

        const empezarJuego = () => { 
            const { cantBombas } = dificultad.dificultadActual;
            timerTablero.value = 0
            pararTimer();
            terminoJuego.value = false;
            emojiJuego.value = '🙂'
            cantBanderas.value = cantBombas;            
            generarTablero();
        }

        const descubrirBombas = () => {
            tablero.value.flat()
                .filter(({ tieneBomba }) => tieneBomba)
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

        const descubrirCeldas = async(celda) => {
            if(celda.tieneBomba){ return pisoBomba(celda) }
        
            const cantBombasVecinas = contarBombasVecinas(celda);
            celda.valor = cantBombasVecinas > 0 ? cantBombasVecinas : "";
            if (!celda.visible) { celda.visible = !celda.visible; }

            await nextTick(() => {  
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
            })
            
            if(!terminoJuego.value) checkearVictoria();
        };

        const acordeCeldas = (celda) => { 
            const celdasVecinasFiltradas = mapearCeldasVecinas(celda).filter( ({ visible, bandera }) => !visible && !bandera); 

            for (let i = 0; i < celdasVecinasFiltradas.length; i++) {
                const celdaVecina = celdasVecinasFiltradas[i];
                descubrirCeldas(celdaVecina);
            }
        }

        const contarBombasVecinas = (celda) => {
            return mapearCeldasVecinas(celda).filter(({tieneBomba}) => tieneBomba).length
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

.tablero-container {
    width: min-content;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    row-gap: 1rem;
}

.info-tablero{
    font: normal normal 400 1.3rem var(--default-font);
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 5vw;
    user-select: none;
}
.info-tablero__btn-reiniciar{
    font-size: inherit;
    background: transparent;
    border: 1px solid grey;
    padding: .3rem;
    user-select: unset;
}

/* .info-tablero__cant-banderas */
/* .info-tablero__cronometro */

.tablero-container__tablero {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    row-gap: 2px;
}

.tablero-container__tablero_intocable{
    pointer-events: none;
}

.fila {
    width: 100%;
    display: flex;
    column-gap: 2px;
    justify-content: center;
    align-items: center;
}
</style>
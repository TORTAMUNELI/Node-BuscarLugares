require('dotenv').config();
const { inquireMenu, leerInput, pausa, listarLugares } = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');
const busquedas = new Busquedas();
const main = async () => {
    const busquedas = new Busquedas();
    let opt;

    do {
        opt = await inquireMenu();
        switch (opt) {
            case 1:
                //Mostrar mensaje
                const termino = await leerInput('Lugar: ');

                //Buscar los lugares
                const lugares = await busquedas.buscarLugar(termino);

                //Seleccionar el lugar
                const id = await listarLugares(lugares);
                if (id === '0') continue;

                const lugarSel = lugares.find(l => l.id === id);


                //Guardar en DB
                busquedas.agregarHistorial(lugarSel.nom);

                //Clima
                // const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);

                //Mostrar resultados
                console.log(`\nInformación de ${lugarSel.nom}\n`.green);
                console.log(`Latitud: ${lugarSel.lat}`);
                console.log(`Longitud: ${lugarSel.lng}`);
                // console.log(`Temperatura: ${clima.temp}`);
                // console.log(`Temperatura máxima: ${clima.max}`);
                // console.log(`Temperatura mínima: ${clima.min}`);
                // console.log(`Descripción: ${clima.desc}`);

                break;
            case 2:
                console.log();
                busquedas.historialCapitalizado.forEach((lugar, i) => {
                    const idx = `${i + 1}.`.green;
                    console.log(`${idx} ${lugar}`);
                });
                break;
        }
        if (opt !== 0) await pausa();
    } while (opt !== 0);
}
main();
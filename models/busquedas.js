const fs = require('fs');
const axios = require('axios');

class Busquedas {
    historial = [];
    dbPath = './DB/database.json';

    constructor() {
        this.leerDB();
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'autocomplete': true,
            'limit': 5,
            'language': 'es'
        }
    }

    get paramsWeather() {
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }

    get historialCapitalizado() {
        return this.historial.map(lugar => {
            let palabras = lugar.split(' ');
            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1));
            return palabras.join(' ');
        });
    }

    async buscarLugar(lugar = '') {
        try {
            //Petición http
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });
            const resp = await instance.get();

            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nom: lugar.text,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));
        } catch (error) {
            console.log(error);
            return [];
        }
        //Retorna los lugares que coincidan con 'lugar'
    }

    async climaLugar(lat, lon) {
        try {
            const instance = axios.create(
                {
                    baseURL: `api.openweathermap.org/data/2.5/weather`,
                    params: { ...this.paramsWeather, lat, lon }
                }
            );
            const resp = await instance.get();

            return resp.data.map(clima => ({
                desc: clima.weather[0].description,
                temp: clima.main.temp,
                max: clima.main.temp_max,
                min: clima.main.temp_min
            }));
        } catch (error) {
            return [];
        }
    }

    agregarHistorial(lugar = '') {
        if (this.historial.includes(lugar.toLowerCase())) {
            return;
        }

        this.historial.unshift(lugar.toLowerCase());
        this.guardarDB();
    }

    guardarDB() {
        if (!fs.existsSync(this.dbPath)) return;

        const payload = {
            historial: this.historial
        }

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    leerDB() {
        if (!fs.existsSync(this.dbPath)) return [];

        const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });

        const data = JSON.parse(info);
        this.historial = data.historial;
        return this.historial;
    }
}

module.exports = Busquedas;
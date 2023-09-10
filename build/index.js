"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cheerio_1 = __importDefault(require("cheerio"));
const axios_1 = __importDefault(require("axios"));
// terminan las dependencias
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = 3000;
app.get('/test', (_req, res) => {
    res.send('<h1>funciona bien</h1>');
});
app.get('/', (_req, res) => {
    res.send('<h1>test bien</h1>');
});
app.get('/data_ant', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let placa = (_a = req.query.placa) === null || _a === void 0 ? void 0 : _a.toString();
    if (placa === undefined) {
        placa = "PBJ7247";
    }
    let data_api = yield getAntData(placa);
    console.log("alguien esta solicitando datos ");
    res.json(data_api);
}));
app.listen(PORT, () => {
    console.log('server running on port 3000');
});
function obtenerHTML(placa) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const apiUrl = `https://consultaweb.ant.gob.ec/PortalWEB/paginas/clientes/clp_grid_citaciones.jsp?ps_tipo_identificacion=PLA&ps_identificacion=${placa}`; // Reemplaza con la URL correcta
            const response = yield axios_1.default.get(apiUrl);
            return response.data; // La respuesta de la API es HTML
        }
        catch (error) {
            throw error;
        }
    });
}
function extraerTitulos(html) {
    return __awaiter(this, void 0, void 0, function* () {
        const $ = cheerio_1.default.load(html); // Cargamos el HTML en cheerio
        const titulos = [];
        // Buscamos todas las etiquetas <h1> con la clase "titulo"
        $('td.detalle_formulario').each((index, element) => {
            const titulo = $(element).text(); // Obtenemos el texto de la etiqueta
            titulos.push(titulo);
        });
        return titulos;
    });
}
function getAntData(placa) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const html = yield obtenerHTML(placa);
            const titulosJSON = yield extraerTitulos(html);
            let data_ant = {
                marca: titulosJSON[0],
                color: titulosJSON[1],
                year: titulosJSON[2],
                descripcion: titulosJSON[3],
                tipo: titulosJSON[4],
                fecha_matricula: titulosJSON[5],
                year_matricula: titulosJSON[6],
                servicio: titulosJSON[7],
            };
            return data_ant;
        }
        catch (error) {
            let data_ant = {
                marca: "",
                color: "",
                year: "",
                descripcion: "",
                tipo: "",
                fecha_matricula: "",
                year_matricula: "",
                servicio: ""
            };
            return data_ant;
        }
    });
}

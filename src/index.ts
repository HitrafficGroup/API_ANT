import express from 'express'
import cheerio from 'cheerio';
import axios from 'axios';



// terminan las dependencias
const app = express()
app.use(express.json())
const PORT = 3000

app.get('/test',(_req,res)=>{
    res.send('<h1>funciona bien</h1>')
})

app.get('/',(_req,res)=>{
    res.send('<h1>test bien</h1>')
})
app.get('/data_ant',async (req,res)=>{
    let placa = req.query.placa?.toString()
    if(placa === undefined){
        placa = "PBJ7247"
      } 
    let data_api = await getAntData(placa)
    console.log("alguien esta solicitando datos ")
    res.json(data_api);
})

app.listen(PORT,()=>{
    console.log('server running on port 3000')
})

interface ApiResponse {
    marca:string,
    color:string,
    year:string,
    descripcion:string,
    tipo:string,
    fecha_matricula:string,
    year_matricula:string,
    servicio:string
  }
async function obtenerHTML(placa:string): Promise<string> {
  try {
    const apiUrl = `https://consultaweb.ant.gob.ec/PortalWEB/paginas/clientes/clp_grid_citaciones.jsp?ps_tipo_identificacion=PLA&ps_identificacion=${placa}`; // Reemplaza con la URL correcta
    const response = await axios.get(apiUrl);
    return response.data; // La respuesta de la API es HTML
  } catch (error) {
    throw error;
  }
}

async function extraerTitulos(html: string): Promise<any> {
    const $ = cheerio.load(html); // Cargamos el HTML en cheerio
  
    const titulos: string[] = [];
  
    // Buscamos todas las etiquetas <h1> con la clase "titulo"
    $('td.detalle_formulario').each((index, element) => {
      const titulo = $(element).text(); // Obtenemos el texto de la etiqueta
      titulos.push(titulo);
    });
  
    return titulos;
  }
  
  async function getAntData(placa:string):Promise<ApiResponse> {
    try {
      const html = await obtenerHTML(placa);
      const titulosJSON = await extraerTitulos(html);
      let data_ant = {
        marca:titulosJSON[0],
        color:titulosJSON[1],
        year:titulosJSON[2],
        descripcion:titulosJSON[3],
        tipo:titulosJSON[4],
        fecha_matricula:titulosJSON[5],
        year_matricula:titulosJSON[6],
        servicio:titulosJSON[7],
      }
      return  data_ant
    } catch (error) {
        let data_ant = {
            marca:"",
            color:"",
            year:"",
            descripcion:"",
            tipo:"",
            fecha_matricula:"",
            year_matricula:"",
            servicio:""
          }
          return  data_ant
    }
  }
  
  

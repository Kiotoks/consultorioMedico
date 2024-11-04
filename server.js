const express = require('express');
const nodemailer = require('nodemailer')
require('dotenv').config();
const bodyParser = require('body-parser');
const port = 3030;
const { writeFileSync } = require('fs');
const WebSocket = require('ws');
const http = require('http');


let cantpedidos = 0

const app = express();

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

let transporter = nodemailer.createTransport({

    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PWD 
    }
})

app.use(bodyParser.json());
app.use(express.static(__dirname +'/public'));

function enviarMail(mail, texto){
    const mailToMe = {
        from:  process.env.SMTP_USER, //correo de ejemplo
        to: mail,
        subject: "Confirmacion de turno",
        text: texto
    }
    transporter.sendMail(mailToMe, (err, info) => {

        console.log('message: ', "se mando el mensaje")
        if (err) {
            console.error(err)
        } else {
            console.log(info)
        }
    })
}

function enviarNotificacion(cita){
    console.log("enviando notificacion");
   
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send( JSON.stringify( cita))
        }
    });
}

async function cargarFecha(cita){
    try {
        let path = "./data.json";
        enviarNotificacion(cita)
        writeFileSync(path, JSON.stringify(cita, null, 2), 'utf8')
    } catch (error) {
        console.error('Error al cargar turno:', error);
        throw error;
    }
}

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});

app.get("/admin", (req, res) => {
    res.sendFile(__dirname + "/views/confirmarFecha.html");
});

app.post("/confirmarTurno", (req, res) => {
    let nombre = `${req.body.nombre}`;
    let hora =`${req.body.hora}` ;
    let doctor = req.body.doctor;
    let fecha = `${req.body.fecha}`;
    let email = `${req.body.email}`;

    text = `Buenos dias ${nombre}. Le informamos que su turno con el doctor ${doctor} ha sido confirmado. Lo esperamos el dia ${fecha} a las ${hora}`
    enviarMail(email,text)
});


app.post('/cargarCita', (req, res) => {
    let nombre = `${req.body.nombre}`;
    let hora =`${req.body.hora}` ;
    let doctor = req.body.doctor;
    let fecha = `${req.body.fecha}`;
    let dni = `${req.body.dni}`;
    let codigoSoc =`${req.body.codigoSoc}` ;
    let email = `${req.body.email}`;


    var json = {
        hora: hora,
        doctor: doctor,
        nombre: nombre,
        dni: dni,
        codigoSoc: codigoSoc,
        email: email,
        fecha: fecha,
        id: codigoSoc + `${cantpedidos}`
    }; 
    
    cantpedidos += 1;

    cargarFecha(json)
    .then(response => {
        res.send(response);
    })
    .catch(error => {
        console.error(error);
        res.status(500).send('Error generando la respuesta.');
    });
});


wss.on('connection', (ws) => {
    console.log('Nuevo cliente conectado');
  
    ws.on('message', (message) => {
      console.log('Mensaje recibido:', message);
    });
  
    // Manejar la desconexión de un cliente
    ws.on('close', () => {
      console.log('Cliente desconectado');
    });
});

server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

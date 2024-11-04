// Conectar al servidor WebSocket
const socket = new WebSocket('ws://localhost:3030');
const turnos = document.getElementById("turnos")
const conf = document.getElementById("confirmar")
conf.addEventListener("click", confirmar)
let arrTurnos = []
let turnoSelec = 0

// Escuchar cuando se abre la conexión
socket.onopen = () => {
    console.log('Conectado al servidor WebSocket');
};

// Escuchar los mensajes recibidos del servidor
socket.onmessage = (event) => {
    var datos = JSON.parse(event.data)
    console.log('Mensaje del servidor:', datos);
    var turnoDiv = document.createElement("div");
    arrTurnos.push(datos)
    turnoDiv.innerHTML = `
        <p><strong>ID:</strong> ${datos.id}</p>
        <p><strong>Nombre:</strong> ${datos.nombre}</p>
        <p><strong>DNI:</strong> ${datos.dni}</p>
        <p><strong>Código Socio:</strong> ${datos.codigoSoc}</p>
        <p><strong>Email:</strong> ${datos.email}</p>
    `;
    turnoDiv.className = "cell"
    turnoDiv.id = arrTurnos.length-1

    turnoDiv.addEventListener("click", manejarClick);

    turnos.appendChild(turnoDiv);

};

function manejarClick(evento) {
    let celdaClickeada = evento.currentTarget; 
    console.log("id del turno:", celdaClickeada.id);
    info = document.getElementById("turno-selec")
    datos = arrTurnos[celdaClickeada.id]
    turnoSelec = celdaClickeada.id
    info.innerHTML = `
        <h1>Datos del paciente</h1>
        <p><strong>Nombre:</strong> ${datos.nombre}</p>
        <p><strong>DNI:</strong> ${datos.dni}</p>
        <p><strong>Código Socio:</strong> ${datos.codigoSoc}</p>
        <p><strong>Email:</strong> ${datos.email}</p>
        <h1>Datos del turno</h1>
        <p><strong>Doctor:</strong> ${datos.doctor}</p>
        <p><strong>Fecha deseada:</strong> ${datos.fecha}</p>
        <p><strong>Hora deseada:</strong> ${datos.hora}</p>
    `;
}

function confirmar(){
    let requestData = arrTurnos[turnoSelec]

    requestData.fecha = document.getElementById("fecha").value
    requestData.hora = document.getElementById("hora").value

    fetch('/confirmarTurno', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    });
}

// Escuchar cuando se cierra la conexión
socket.onclose = () => {
    console.log('Desconectado del servidor WebSocket');
};

// Escuchar errores
socket.onerror = (error) => {
    console.error('Error en WebSocket:', error);
};
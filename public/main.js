document.getElementById("cargarFecha").addEventListener("click", cargarFecha);

function cargarFecha(){
    
    let hora = document.getElementById("hora").value;
    let doctor = document.getElementById("doctor").value;
    let nombre = document.getElementById("nombre").value;
    let fecha = document.getElementById("fecha").value;
    let dni = document.getElementById("dni").value;
    let codigoSoc = document.getElementById("codigoSoc").value;
    let email = document.getElementById("email").value;

    var requestData = {
        hora: hora,
        doctor: doctor,
        nombre: nombre,
        dni: dni,
        codigoSoc: codigoSoc,
        email: email,
        fecha: fecha
    };
    
    fetch('/cargarCita', {
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
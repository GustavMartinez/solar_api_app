let map;
let marker;

function initMap() {
  const centroInicial = { lat: -23.5505, lng: -46.6333 }; // São Paulo por defecto
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: centroInicial,
  });
}

async function buscarDireccion() {
  const direccion = document.getElementById("address").value;
  const apiKey = 'AIzaSyD7SfO-KW7WakGH2Ozbftiwv1xW89PztI0'; // Puedes reemplazar por una variable si prefieres

  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(direccion)}&key=${apiKey}`;
  const respuesta = await fetch(geocodeUrl);
  const datos = await respuesta.json();

  if (datos.status === "OK") {
    const { lat, lng } = datos.results[0].geometry.location;

    // Centrar y marcar en el mapa
    map.setCenter({ lat, lng });
    if (marker) marker.setMap(null);
    marker = new google.maps.Marker({ position: { lat, lng }, map });

    // Consultar backend para obtener datos solares
    const solarResp = await fetch('/api/solar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat, lng }),
    });
    const solarData = await solarResp.json();

    mostrarResultados(solarData);
  } else {
    alert("No se pudo geocodificar la dirección");
  }
}

function mostrarResultados(data) {
  const div = document.getElementById("resultados");
  if (data.solarPotential) {
    const potencia = data.solarPotential.maxArrayAreaMeters2;
    const produccion = data.solarPotential.maxSunshineHoursPerYear;
    div.innerHTML = `
      <h3>Resultado Solar:</h3>
      <p><strong>Área máxima de paneles:</strong> ${potencia} m²</p>
      <p><strong>Horas de sol por año:</strong> ${produccion}</p>
    `;
  } else {
    div.innerHTML = `<p>No se encontraron datos solares para esta ubicación.</p>`;
  }
}

// Al iniciar la aplicación, verifica si ya hay datos en localStorage
if (!localStorage.getItem('attendanceRecords')) {
  localStorage.setItem('attendanceRecords', JSON.stringify([]));
}

// Botón de "Entrada"
document.getElementById('checkInBtn').addEventListener('click', function () {
  const name = document.getElementById('name').value;
  const currentDate = new Date().toLocaleDateString(); // Fecha actual

  // Verificar si ya se ha registrado en el mismo día (entrada o salida)
  let records = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
  let todayRecord = records.find(record => record.name === name && record.date === currentDate);

  if (todayRecord) {
      alert("Ya has registrado tu entrada o salida hoy.");
      return;
  }

  // Obtener la hora de entrada automáticamente
  const entryTime = new Date().toLocaleTimeString();

  // Obtener la geolocalización (latitud y longitud)
  navigator.geolocation.getCurrentPosition(function (position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      // Guardar datos de entrada
      saveDataLocally(name, entryTime, "", lat, lon, currentDate);
  }, function (error) {
      console.error("Error al obtener la ubicación:", error);
      alert("No se pudo obtener la ubicación. Intenta de nuevo.");
  });
});

// Botón de "Salida"
document.getElementById('checkOutBtn').addEventListener('click', function () {
  const name = document.getElementById('name').value;
  const currentDate = new Date().toLocaleDateString(); // Fecha actual

  // Verificar si ya se ha registrado en el mismo día (entrada o salida)
  let records = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
  let todayRecord = records.find(record => record.name === name && record.date === currentDate);

  if (!todayRecord) {
      alert("No has registrado tu entrada hoy.");
      return;
  }

  // Obtener la hora de salida automáticamente
  const exitTime = new Date().toLocaleTimeString();

  // Obtener la geolocalización (latitud y longitud)
  navigator.geolocation.getCurrentPosition(function (position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      // Actualizar los datos de salida
      todayRecord.exitTime = exitTime;
      todayRecord.exitLat = lat;
      todayRecord.exitLon = lon;

      // Actualizar el registro en localStorage
      localStorage.setItem('attendanceRecords', JSON.stringify(records));
      alert("Salida registrada con éxito.");
  }, function (error) {
      console.error("Error al obtener la ubicación:", error);
      alert("No se pudo obtener la ubicación. Intenta de nuevo.");
  });
});

// Función para guardar los datos en localStorage
function saveDataLocally(name, entryTime, exitTime, lat, lon, currentDate) {
  let data = {
      name,
      entryTime,
      exitTime,
      entryLat: lat,
      entryLon: lon,
      date: currentDate
  };

  let records = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
  records.push(data);
  localStorage.setItem('attendanceRecords', JSON.stringify(records));

  alert("Entrada registrada con éxito.");
}

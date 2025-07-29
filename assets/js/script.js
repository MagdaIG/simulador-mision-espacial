const nave = {
  nombre: "Odisea Galáctica",
  modelo: "XJ-900",
  distancia: 0,
  distanciaObjetivo: 150000,
  estado: true,
  dia: 1,
  recursos: {
    agua: Math.floor(Math.random() * 100 + 50),
    comida: Math.floor(Math.random() * 100 + 50),
    energia: Math.floor(Math.random() * 100 + 50),
  },
  tripulacion: [
    { nombre: "Alice", rol: "Capitán", salud: 100 },
    { nombre: "Bob", rol: "Ingeniero", salud: 90 },
    { nombre: "Clara", rol: "Médico", salud: 85 }
  ],
  eventos: [
    "Descubierto un nuevo planeta",
    "Tormenta de asteroides evitada",
    "Falla en el sistema de navegación",
    "Contacto con señal desconocida",
    "Recursos encontrados en asteroide",
    "Sistema estelar desconocido explorado",
    "Anomalía gravitacional detectada"
  ]
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
  mostrarDatos();
  log("Sistema inicializado", "info");
  log(`Bienvenidos a bordo de la ${nave.nombre}`, "success");
  log("Misión iniciada. Buen viaje, tripulación!", "success");

  // Mostrar modal de configuración al inicio
  setTimeout(() => {
    const modal = new bootstrap.Modal(document.getElementById('modalConfig'));
    modal.show();
  }, 500);
});

function mostrarDatos() {
  document.getElementById("naveNombre").textContent = nave.nombre;
  document.getElementById("naveModelo").textContent = nave.modelo;
  document.getElementById("distancia").textContent = nave.distancia.toLocaleString();

  const estadoBadge = document.getElementById("estadoMision");
  estadoBadge.textContent = nave.estado ? "Activa" : "Finalizada";
  estadoBadge.className = "badge " + (nave.estado ? "bg-success" : "bg-secondary");

  // Actualizar recursos
  document.getElementById("agua-value").textContent = `${nave.recursos.agua}%`;
  document.getElementById("comida-value").textContent = `${nave.recursos.comida}%`;
  document.getElementById("energia-value").textContent = `${nave.recursos.energia}%`;

  document.getElementById("agua-bar").style.width = `${nave.recursos.agua}%`;
  document.getElementById("comida-bar").style.width = `${nave.recursos.comida}%`;
  document.getElementById("energia-bar").style.width = `${nave.recursos.energia}%`;

  // Actualizar barras de salud según nivel
  document.getElementById("agua-bar").className = `progress-bar ${getResourceClass(nave.recursos.agua)}`;
  document.getElementById("comida-bar").className = `progress-bar ${getResourceClass(nave.recursos.comida)}`;
  document.getElementById("energia-bar").className = `progress-bar ${getResourceClass(nave.recursos.energia)}`;

  // Actualizar tripulación
  const ul = document.getElementById("listaTripulantes");
  ul.innerHTML = "";

  nave.tripulacion.forEach(t => {
    const memberDiv = document.createElement("div");
    memberDiv.className = "crew-member";

    memberDiv.innerHTML = `
      <div>
        <strong>${t.nombre}</strong> <span class="text-muted">(${t.rol})</span>
      </div>
      <div class="d-flex align-items-center gap-2">
        <small>${t.salud}%</small>
        <div class="health">
          <div class="health-bar" style="width: ${t.salud}%; background-color: ${getHealthColor(t.salud)}"></div>
        </div>
      </div>
    `;

    ul.appendChild(memberDiv);
  });

  // Actualizar estadísticas de tripulación
  const promedio = nave.tripulacion.reduce((acc, t) => acc + t.salud, 0) / nave.tripulacion.length;
  const criticos = nave.tripulacion.filter(t => t.salud < 50).length;

  document.getElementById("saludPromedio").textContent = `${promedio.toFixed(1)}%`;
  document.getElementById("saludPromedio").className = `badge ${getHealthBadgeClass(promedio)}`;
  document.getElementById("tripulantesCriticos").textContent = criticos;

  // Actualizar día de misión
  document.getElementById("diaMision").textContent = nave.dia;

  // Actualizar progreso de la misión
  const progreso = Math.min((nave.distancia / nave.distanciaObjetivo) * 100, 100);
  document.getElementById("progresoMision").style.width = `${progreso}%`;

  // Verificar condiciones de fin de misión
  verificarEstadoMision();
}

function getResourceClass(value) {
  if (value < 20) return "bg-danger";
  if (value < 50) return "bg-warning";
  return "bg-success";
}

function getHealthColor(value) {
  if (value < 30) return "#FF5252";
  if (value < 60) return "#FFA500";
  return "#4CAF50";
}

function getHealthBadgeClass(value) {
  if (value < 50) return "bg-danger";
  if (value < 70) return "bg-warning";
  return "bg-success";
}

function log(mensaje, tipo = "info") {
  const bitacora = document.getElementById("bitacora");
  const entry = document.createElement("div");
  entry.className = `log-entry log-${tipo}`;

  const now = new Date();
  const timeString = now.toLocaleTimeString();

  entry.innerHTML = `
    <span class="log-date">Día ${nave.dia} - ${timeString}</span>: ${mensaje}
  `;

  bitacora.prepend(entry);

  // Limitar el número de entradas en la bitácora
  if (bitacora.children.length > 50) {
    bitacora.removeChild(bitacora.lastChild);
  }

  // Auto-scroll to top
  bitacora.scrollTop = 0;
}

function mostrarModal(mensaje, tipo = "info") {
  document.getElementById("modalMensaje").textContent = mensaje;
  const modal = new bootstrap.Modal(document.getElementById("modalAlerta"));
  modal.show();

  // Registrar en bitácora
  log(mensaje, tipo);
}

function mostrarModalTripulante() {
  document.getElementById("nombreTripulante").value = "";
  document.getElementById("rolTripulante").value = "Ingeniero";
  const modal = new bootstrap.Modal(document.getElementById("modalTripulante"));
  modal.show();
}

function agregarTripulante() {
  const nombre = document.getElementById("nombreTripulante").value.trim();
  const rol = document.getElementById("rolTripulante").value;

  if (!nombre) {
    mostrarModal("Debe ingresar un nombre para el tripulante", "warning");
    return;
  }

  // Verificar si el tripulante ya existe
  if (nave.tripulacion.some(t => t.nombre.toLowerCase() === nombre.toLowerCase())) {
    mostrarModal("Ya existe un tripulante con ese nombre", "warning");
    return;
  }

  // Agregar nuevo tripulante
  nave.tripulacion.push({
    nombre: nombre,
    rol: rol,
    salud: 80 + Math.floor(Math.random() * 20) // Salud inicial entre 80-100
  });

  mostrarModal(`Tripulante ${nombre} agregado como ${rol}`, "success");
  mostrarDatos();

  // Cerrar modal
  const modal = bootstrap.Modal.getInstance(document.getElementById("modalTripulante"));
  modal.hide();
}

function explorar() {
  if (nave.recursos.energia < 15) {
    mostrarModal("No hay suficiente energía para explorar", "danger");
    return;
  }

  // Consumir recursos
  nave.recursos.agua -= 10;
  nave.recursos.energia -= 15;

  // Afectar salud de manera aleatoria
  nave.tripulacion.forEach(t => {
    t.salud -= Math.floor(Math.random() * 10) + 1; // Entre 1-10 de daño
    if (t.salud < 0) t.salud = 0;
  });

  // Avanzar distancia
  const distanciaAvanzada = Math.floor(Math.random() * 5000) + 1000;
  nave.distancia += distanciaAvanzada;

  // Evento aleatorio
  const evento = nave.eventos[Math.floor(Math.random() * nave.eventos.length)];

  mostrarModal(`Exploración completada: ${evento}. Avanzados ${distanciaAvanzada.toLocaleString()} km`, "success");
  mostrarDatos();
}

function comer() {
  const comidaNecesaria = nave.tripulacion.length * 5;

  if (nave.recursos.comida < comidaNecesaria) {
    mostrarModal(`No hay suficiente comida (se necesitan ${comidaNecesaria}%)`, "danger");
    return;
  }

  nave.recursos.comida -= comidaNecesaria;

  // Mejorar salud
  nave.tripulacion.forEach(t => {
    t.salud += Math.floor(Math.random() * 10) + 5; // Entre 5-15 de mejora
    if (t.salud > 100) t.salud = 100;
  });

  mostrarModal("La tripulación ha comido. Salud mejorada.", "success");
  mostrarDatos();
}

function descansar() {
  if (nave.recursos.energia < 5) {
    mostrarModal("No hay suficiente energía para descansar", "danger");
    return;
  }

  nave.recursos.energia -= 5;

  // Recuperar salud
  nave.tripulacion.forEach(t => {
    t.salud += Math.floor(Math.random() * 15) + 5; // Entre 5-20 de mejora
    if (t.salud > 100) t.salud = 100;
  });

  mostrarModal("La tripulación ha descansado. Salud recuperada.", "success");
  mostrarDatos();
}

function reparar() {
  if (nave.recursos.energia < 20) {
    mostrarModal("No hay suficiente energía para reparar", "danger");
    return;
  }

  nave.recursos.energia -= 20;

  // Reparar puede recuperar algunos recursos
  nave.recursos.agua = Math.min(nave.recursos.agua + 5, 100);
  nave.recursos.comida = Math.min(nave.recursos.comida + 5, 100);

  // Mejorar salud un poco
  nave.tripulacion.forEach(t => {
    t.salud += Math.floor(Math.random() * 5) + 1; // Entre 1-6 de mejora
    if (t.salud > 100) t.salud = 100;
  });

  mostrarModal("Sistemas reparados. Algunos recursos recuperados.", "success");
  mostrarDatos();
}

function reportar() {
  const promedio = nave.tripulacion.reduce((acc, t) => acc + t.salud, 0) / nave.tripulacion.length;
  const criticos = nave.tripulacion.filter(t => t.salud < 50).length;
  const recursosBajos = Object.values(nave.recursos).filter(r => r < 30).length;

  let mensaje = `Reporte del día ${nave.dia}:\n`;
  mensaje += `- Salud promedio: ${promedio.toFixed(1)}%\n`;
  mensaje += `- Tripulantes críticos: ${criticos}\n`;
  mensaje += `- Recursos bajos: ${recursosBajos}\n`;
  mensaje += `- Distancia recorrida: ${nave.distancia.toLocaleString()} km (${(nave.distancia / nave.distanciaObjetivo * 100).toFixed(1)}% del objetivo)`;

  mostrarModal(mensaje, "info");
}

function avanzarDia() {
  nave.dia++;

  // Consumo diario de recursos
  nave.recursos.agua -= nave.tripulacion.length * 2;
  nave.recursos.comida -= nave.tripulacion.length * 3;
  nave.recursos.energia -= 5;

  // Asegurar que no bajen de 0
  Object.keys(nave.recursos).forEach(r => {
    if (nave.recursos[r] < 0) nave.recursos[r] = 0;
  });

  // Pequeña posibilidad de evento aleatorio
  if (Math.random() < 0.3) {
    const eventosAleatorios = [
      "Tormenta solar detectada. Sistemas afectados.",
      "Problema en el sistema de reciclaje de agua.",
      "Celebración a bordo. Moral mejorada.",
      "Falla menor en los motores. Energía consumida.",
      "Descubierto asteroide con recursos."
    ];

    const evento = eventosAleatorios[Math.floor(Math.random() * eventosAleatorios.length)];
    log(evento, Math.random() < 0.5 ? "warning" : "info");

    // Aplicar efectos del evento
    if (evento.includes("Tormenta solar")) {
      nave.recursos.energia -= 10;
      nave.tripulacion.forEach(t => t.salud -= 5);
    } else if (evento.includes("reciclaje de agua")) {
      nave.recursos.agua -= 15;
    } else if (evento.includes("Celebración")) {
      nave.tripulacion.forEach(t => t.salud += 5);
    } else if (evento.includes("motores")) {
      nave.recursos.energia -= 10;
    } else if (evento.includes("recursos")) {
      nave.recursos.agua += 10;
      nave.recursos.comida += 10;
    }
  }

  log(`Comienza el día ${nave.dia} de la misión`, "info");
  mostrarDatos();
}
function verificarEstadoMision() {
  // Verificar si se alcanzó la distancia objetivo
  if (nave.distancia >= nave.distanciaObjetivo && nave.estado) {
    nave.estado = false;
    mostrarModal("¡Misión cumplida! Hemos alcanzado nuestro objetivo.", "success");
    log("¡Misión cumplida! Objetivo alcanzado.", "success");
    return; // Detener ejecución
  }

  // Verificar si hay tripulantes con salud crítica
  const criticos = nave.tripulacion.filter(t => t.salud <= 0).length;
  if (criticos > 0 && nave.estado) {
    nave.estado = false;
    mostrarModal(`¡Emergencia! ${criticos} tripulante(s) en estado crítico. Misión abortada.`, "danger");
    log("Misión abortada debido a tripulantes en estado crítico.", "danger");
    return;
  }

  // Verificar recursos críticos
  const recursosCriticos = Object.values(nave.recursos).filter(r => r <= 0).length;
  if (recursosCriticos > 0 && nave.estado) {
    nave.estado = false;
    mostrarModal(`¡Emergencia! Se han agotado ${recursosCriticos} recursos esenciales. Misión abortada.`, "danger");
    log("Misión abortada debido a falta de recursos esenciales.", "danger");
    return;
  }
}
function limpiarBitacora() {
  document.getElementById("bitacora").innerHTML = "";
  log("Bitácora limpiada", "info");
}

function guardarConfiguracion() {
  const nombre = document.getElementById("nombreNave").value.trim();
  const modelo = document.getElementById("modeloNave").value.trim();
  const distancia = parseInt(document.getElementById("distanciaObjetivo").value);

  if (!nombre || !modelo || isNaN(distancia) || distancia <= 0) {
    mostrarModal("Por favor ingrese valores válidos para la configuración", "warning");
    return;
  }

  nave.nombre = nombre;
  nave.modelo = modelo;
  nave.distanciaObjetivo = distancia;
  nave.distancia = 0;
  nave.dia = 1;
  nave.estado = true;

  // Resetear recursos
  nave.recursos = {
    agua: Math.floor(Math.random() * 100 + 50),
    comida: Math.floor(Math.random() * 100 + 50),
    energia: Math.floor(Math.random() * 100 + 50)
  };

  // Resetear tripulación (mantener al menos 3 miembros)
  if (nave.tripulacion.length < 3) {
    nave.tripulacion = [
      { nombre: "Alice", rol: "Capitán", salud: 100 },
      { nombre: "Bob", rol: "Ingeniero", salud: 90 },
      { nombre: "Clara", rol: "Médico", salud: 85 }
    ];
  } else {
    // Resetear salud de la tripulación existente
    nave.tripulacion.forEach(t => t.salud = 80 + Math.floor(Math.random() * 20));
  }

  mostrarModal("Configuración guardada. ¡Nueva misión iniciada!", "success");
  log("Nueva misión configurada", "info");
  log(`Objetivo: Viajar ${nave.distanciaObjetivo.toLocaleString()} km`, "info");

  // Limpiar bitácora
  document.getElementById("bitacora").innerHTML = "";

  mostrarDatos();

  // Cerrar modal
  const modal = bootstrap.Modal.getInstance(document.getElementById("modalConfig"));
  modal.hide();
}

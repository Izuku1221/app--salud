let alimentos = [
    { nombre: "Espinacas cocidas (100g)", detalle: "3.6 mg de Hierro", tipo: "alto" },
    { nombre: "Lentejas cocidas (100g)", detalle: "3.3 mg de Hierro", tipo: "alto" },
    { nombre: "Avena Integral (100g)", detalle: "Fibra soluble de absorción lenta", tipo: "diabetes" },
    { nombre: "Brócoli al vapor (100g)", detalle: "Muy bajo índice glucémico", tipo: "diabetes" },
    { nombre: "Carne de res magra (100g)", detalle: "2.7 mg de Hierro", tipo: "alto" },
    { nombre: "Manzana Verde (1 pieza)", detalle: "Baja carga de fructosa", tipo: "diabetes" }
];

let vasosTomados = 0; let metaVasos = 0; let litrosMeta = 0; let edadUsuario = 0;

window.onload = function() {
    filtrarAlimentos();
};

function filtrarAlimentos() {
    const filtro = document.getElementById("selectCategoria").value;
    const lista = document.getElementById("listaAlimentos");
    lista.innerHTML = "";
    
    alimentos.forEach(alimento => {
        if (filtro === "todos" || alimento.tipo === filtro) {
            let badge = alimento.tipo === 'alto' ? '🔴 Hierro' : '🟢 Diabetes Safe';
            lista.innerHTML += `<div class="item-alimento">
                <strong>${alimento.nombre}</strong> - <span>${alimento.detalle}</span> [${badge}]
            </div>`;
        }
    });
}

function agregarAlimento() {
    const claveInput = document.getElementById("claveAdmin").value;
    if (claveInput !== "1234") { 
        alert("Código de autorización incorrecto. No tienes permisos para modificar los datos."); 
        return; 
    }

    const nom = document.getElementById("nuevoNombre").value.trim();
    const det = document.getElementById("nuevoDetalle").value.trim();
    const cla = document.getElementById("nuevaClasif").value;

    if (!nom || !det) { alert("Por favor rellena ambos campos del alimento"); return; }

    alimentos.push({ nombre: nom, detalle: det, tipo: cla });
    alert(`¡${nom} ha sido agregado con éxito!`);
    
    document.getElementById("nuevoNombre").value = "";
    document.getElementById("nuevoDetalle").value = "";
    document.getElementById("claveAdmin").value = "";
    filtrarAlimentos();
}

function calcularTodo() {
    const peso = parseFloat(document.getElementById('peso').value);
    const estatura = parseFloat(document.getElementById('estatura').value) / 100;
    edadUsuario = parseInt(document.getElementById('edad').value);
    const sexo = document.getElementById('sexo').value;
    const factorString = document.getElementById('actividad').value;
    const factor = parseFloat(factorString);

    if(!peso || !estatura || !edadUsuario) { alert("Por favor, llena todos los datos de la sección 1"); return; }

    const imc = (peso / (estatura * estatura)).toFixed(1);
    let ger = (sexo === "M") ? (10 * peso) + (6.25 * (estatura * 100)) - (5 * edadUsuario) + 5 : (10 * peso) + (6.25 * (estatura * 100)) - (5 * edadUsuario) - 161;
    const get = ger * factor;

    let gKgProteina = 1.2; 
    if (factorString === "1.375") gKgProteina = 1.4;
    else if (factorString === "1.55") gKgProteina = 1.6;
    else if (factorString === "1.725") gKgProteina = 1.8;
    else if (factorString === "1.9") gKgProteina = 2.0;

    const protGramos = peso * gKgProteina;
    const protCalorias = protGramos * 4;
    const lipCalorias = get * 0.25;
    const lipGramos = lipCalorias / 9;
    const carbsCalorias = get - (protCalorias + lipCalorias);
    const carbsGramos = carbsCalorias / 4;

    litrosMeta = (peso * 35) / 1000;
    metaVasos = Math.ceil((peso * 35) / 250);
    vasosTomados = 0;

    document.getElementById("txtIMC").innerHTML = `<strong>IMC:</strong> ${imc}`;
    document.getElementById("txtGER").innerHTML = `<strong>GER (Reposo):</strong> ${Math.round(ger)} kcal`;
    document.getElementById("txtGET").innerHTML = `<strong>Gasto Total Diario (GET):</strong> ${Math.round(get)} kcal requeridas.`;
    
    document.getElementById("gramosProt").innerText = `${protGramos.toFixed(1)}g`;
    document.getElementById("calProt").innerText = `${Math.round(protCalorias)} kcal`;
    document.getElementById("gramosLip").innerText = `${lipGramos.toFixed(1)}g`;
    document.getElementById("calLip").innerText = `${Math.round(lipCalorias)} kcal`;
    document.getElementById("gramosCarbs").innerText = `${carbsGramos.toFixed(1)}g`;
    document.getElementById("calCarbs").innerText = `${Math.round(carbsCalorias)} kcal`;

    document.getElementById("txtAguaMeta").innerHTML = `<strong>Tu Meta de Hidratación:</strong> ${litrosMeta.toFixed(2)} L al día (Aproximadamente <strong>${metaVasos} vasos</strong>).`;
    document.getElementById("vasosContador").innerText = vasosTomados;
    
    document.getElementById("resPresion").style.display = "none";
    document.getElementById("resColesterol").style.display = "none";
    document.getElementById("resDiabetes").style.display = "none";
    document.getElementById("resTest").style.display = "none";
    actualizarProgresoAgua();

    document.getElementById("resultadoCalculos").style.display = "block";
}

function analizarPresion() {
    const sis = parseInt(document.getElementById("presSistolica").value);
    const dia = parseInt(document.getElementById("presDiastolica").value);
    const caja = document.getElementById("resPresion");
    if(!sis || !dia) { alert("Ingresa ambos valores de presión"); return; }
    caja.style.display = "block";
    
    if (edadUsuario < 18) {
        if (sis <= 115 && dia <= 75) {
            cbox(caja, "#dcfce7", "#15803d", "#22c55e", "<strong>Rango Adolescente:</strong> Presión Arterial Normal.");
        } else {
            cbox(caja, "#fff1f2", "#9f1239", "#f43f5e", "<strong>Rango Adolescente:</strong> Presión Elevada. Se sugiere revisión.");
        }
    } else {
        if (sis < 120 && dia < 80) {
            cbox(caja, "#dcfce7", "#15803d", "#22c55e", "<strong>Adulto:</strong> Presión Arterial Normal.");
        } else if (sis >= 120 && sis <= 129 && dia < 80) {
            cbox(caja, "#fef3c7", "#92400e", "#f59e0b", "<strong>Adulto:</strong> Presión Arterial Elevada. Reducir sal.");
        } else {
            cbox(caja, "#fff1f2", "#9f1239", "#f43f5e", "<strong>Adulto:</strong> Presión Alta (Hipertensión clínica).");
        }
    }
}

function analizarColesterol() {
    const col = parseInt(document.getElementById("colesterolInput").value);
    const caja = document.getElementById("resColesterol");
    if(!col) { alert("Ingresa el nivel de colesterol"); return; }
    caja.style.display = "block";

    if (edadUsuario < 18) {
        if (col < 170) {
            cbox(caja, "#dcfce7", "#15803d", "#22c55e", `<strong>Menor de edad:</strong> Nivel Óptimo (${col} mg/dL).`);
        } else if (col >= 170 && col <= 199) {
            cbox(caja, "#fef3c7", "#92400e", "#f59e0b", `<strong>Menor de edad:</strong> Límite Alto (${col} mg/dL).`);
        } else {
            cbox(caja, "#fff1f2", "#9f1239", "#f43f5e", `<strong>Menor de edad:</strong> Colesterol ALTO.`);
        }
    } else {
        if (col < 200) {
            cbox(caja, "#dcfce7", "#15803d", "#22c55e", `<strong>Adulto:</strong> Nivel Deseable (${col} mg/dL).`);
        } else if (col >= 200 && col <= 239) {
            cbox(caja, "#fef3c7", "#92400e", "#f59e0b", `<strong>Adulto:</strong> Límite Alto (${col} mg/dL).`);
        } else {
            cbox(caja, "#fff1f2", "#9f1239", "#f43f5e", `<strong>Adulto:</strong> Colesterol Elevado.`);
        }
    }
}

function analizarDiabetes() {
    const glu = parseInt(document.getElementById("glucosaInput").value);
    const estado = document.getElementById("estadoGlucosa").value;
    const caja = document.getElementById("resDiabetes");
    if(!glu) { alert("Ingresa tu nivel de glucosa"); return; }
    caja.style.display = "block";

    if (estado === "ayunas") {
        if (glu < 100) {
            cbox(caja, "#dcfce7", "#15803d", "#22c55e", `<strong>Glucosa (En Ayunas):</strong> Normal (${glu} mg/dL).`);
        } else if (glu >= 100 && glu <= 125) {
            cbox(caja, "#fef3c7", "#92400e", "#f59e0b", `<strong>Glucosa (En Ayunas):</strong> Prediabetes (${glu} mg/dL).`);
        } else {
            cbox(caja, "#fff1f2", "#9f1239", "#f43f5e", `<strong>Glucosa (En Ayunas):</strong> Rango de Diabetes (${glu} mg/dL).`);
        }
    } else {
        if (glu < 140) {
            cbox(caja, "#dcfce7", "#15803d", "#22c55e", `<strong>Glucosa (Post-ingesta):</strong> Normal (${glu} mg/dL).`);
        } else if (glu >= 140 && glu <= 199) {
            cbox(caja, "#fef3c7", "#92400e", "#f59e0b", `<strong>Glucosa (Post-ingesta):</strong> Prediabetes (${glu} mg/dL).`);
        } else {
            cbox(caja, "#fff1f2", "#9f1239", "#f43f5e", `<strong>Glucosa (Post-ingesta):</strong> Rango elevado de Diabetes (${glu} mg/dL).`);
        }
    }
}

function calcularTest() {
    const v1 = parseInt(document.getElementById("p1").value);
    const v2 = parseInt(document.getElementById("p2").value);
    const v3 = parseInt(document.getElementById("p3").value);
    const v4 = parseInt(document.getElementById("p4").value);
    const v5 = parseInt(document.getElementById("p5").value);
    
    const puntajeTotal = v1 + v2 + v3 + v4 + v5;
    const cajaTest = document.getElementById("resTest");
    cajaTest.style.display = "block";

    if (puntajeTotal >= 13) {
        cbox(cajaTest, "#dcfce7", "#15803d", "#22c55e", `<strong>Puntaje: ${puntajeTotal} / 15 (Excelente)</strong><br>¡Balance metabólico ideal!`);
    } else if (puntajeTotal >= 9 && puntajeTotal <= 12) {
        cbox(cajaTest, "#fef3c7", "#92400e", "#f59e0b", `<strong>Puntaje: ${puntajeTotal} / 15 (Moderado)</strong><br>Buenos hábitos, vigila el uso de pantallas.`);
    } else {
        cbox(cajaTest, "#fff1f2", "#9f1239", "#f43f5e", `<strong>Puntaje: ${puntajeTotal} / 15 (Riesgo)</strong><br>Se aconseja mejorar la actividad física.`);
    }
}

function cambiarVasos(amount) {
    vasosTomados += amount;
    if (vasosTomados < 0) vasosTomados = 0;
    document.getElementById("vasosContador").innerText = vasosTomados;
    actualizarProgresoAgua();
}

function actualizarProgresoAgua() {
    const litrosActuales = (vasosTomados * 250) / 1000;
    const progresoBox = document.getElementById("txtAguaProgreso");
    if (vasosTomados >= metaVasos) {
        progresoBox.style.backgroundColor = "#dcfce7"; progresoBox.style.color = "#15803d";
        progresoBox.innerHTML = `🎉 ¡Meta cumplida! Llevas ${litrosActuales.toFixed(2)} Litros.`;
    } else {
        progresoBox.style.backgroundColor = "#f8fafc"; progresoBox.style.color = "#333";
        progresoBox.innerHTML = `Llevas: ${litrosActuales.toFixed(2)} / ${litrosMeta.toFixed(2)} Litros`;
    }
}

function cbox(e, bg, cl, bc, txt) {
    e.style.background = bg; e.style.color = cl; e.style.borderLeftColor = bc; e.innerHTML = txt;
}

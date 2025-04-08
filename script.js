import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD1Kmau5rYrNMwk6QnutzXf42nUs-vzXcs",
  authDomain: "lista-de-tareas-bc637.firebaseapp.com",
  projectId: "lista-de-tareas-bc637",
  storageBucket: "lista-de-tareas-bc637.appspot.com",
  messagingSenderId: "988146334173",
  appId: "1:988146334173:web:0f18ee2e0d3685d28f5e34"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ------------------------------------------------

const tareaInput = document.getElementById("tareaInput");
const agregarBtn = document.getElementById("agregarBtn");
const listaTareas = document.getElementById("listaTareas");

document.addEventListener("DOMContentLoaded", cargarTareas);

agregarBtn.addEventListener("click", agregarTarea);
tareaInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    agregarTarea();
  }
});

async function guardarTareaEnFirestore(titulo) {
  try {
    const docRef = await addDoc(collection(db, "tareas"), {
      titulo: titulo,
      completado: false,
      fecha: new Date()
    });
    console.log("🔥 Tarea guardada en Firestore con ID:", docRef.id);
  } catch (e) {
    console.error("❌ Error al guardar tarea:", e);
  }
}

function agregarTarea() {
  const texto = tareaInput.value.trim();
  if (texto !== "") {
    const tarea = {
      texto: texto,
      completada: false,
    };

    const tareas = obtenerTareas();
    tareas.push(tarea);
    guardarTareas(tareas);
    mostrarTareas();
    guardarTareaEnFirestore(texto); // 🔥 Guardamos en Firestore

    tareaInput.value = "";
    tareaInput.focus();
  }
}

function mostrarTareas() {
  listaTareas.innerHTML = "";
  const tareas = obtenerTareas();

  tareas.forEach((tarea, index) => {
    const nuevaTarea = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = tarea.completada;
    checkbox.style.marginRight = "10px"; // Separación
    checkbox.addEventListener("change", () => {
      tareas[index].completada = checkbox.checked;
      guardarTareas(tareas);
    });

    const textoTarea = document.createElement("span");
    textoTarea.textContent = tarea.texto;
    if (tarea.completada) {
      textoTarea.style.textDecoration = "line-through";
      textoTarea.style.color = "#888";
    }

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.classList.add("eliminar");
    btnEliminar.addEventListener("click", () => {
      tareas.splice(index, 1);
      guardarTareas(tareas);
      mostrarTareas();
    });

    nuevaTarea.appendChild(checkbox);
    nuevaTarea.appendChild(textoTarea);
    nuevaTarea.appendChild(btnEliminar);
    listaTareas.appendChild(nuevaTarea);
  });
}

function obtenerTareas() {
  const tareasGuardadas = localStorage.getItem("tareas");
  return tareasGuardadas ? JSON.parse(tareasGuardadas) : [];
}

function guardarTareas(tareas) {
  localStorage.setItem("tareas", JSON.stringify(tareas));
}

function cargarTareas() {
  mostrarTareas();
}
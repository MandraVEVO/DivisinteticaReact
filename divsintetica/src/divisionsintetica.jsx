import React, { useState } from "react";
import { Opulento } from "uvcanvas"



function DivisionSintetica() {
  const [grado, setGrado] = useState("");
  const [coeficientes, setCoeficientes] = useState([]);
  const [logVisual, setLogVisual] = useState([]);
  const [raices, setRaices] = useState([]);
  const [polinomio, setPolinomio] = useState("");

  // Cambia el grado y actualiza los coeficientes como una lista vacía de longitud grado + 1
  const handleGradoChange = (e) => {
    const grado = parseInt(e.target.value) || 0;
    setGrado(grado);
    setCoeficientes(Array(grado + 1).fill("")); // Inicializa los coeficientes vacíos
    setPolinomio(""); // Limpiar el polinomio
  };

  // Genera el polinomio en formato legible a partir de los coeficientes
  const generatePolinomio = () => {
    let resultado = "";
    for (let i = 0; i < coeficientes.length; i++) {
      const coef = coeficientes[i];
      if (coef !== 0) {
        const exp = grado - i;
        resultado += `${coef > 0 && i !== 0 ? " + " : ""}${coef}${exp > 0 ? "x^" + exp : ""}`;
      }
    }
    return resultado || "0";
  };

  // Actualiza el coeficiente en el índice correspondiente
  const handleCoeficienteChange = (index, value) => {
    const nuevosCoeficientes = [...coeficientes];
    nuevosCoeficientes[index] = parseFloat(value) || 0; // Asegura que el valor sea numérico
    setCoeficientes(nuevosCoeficientes);
    setPolinomio(generatePolinomio()); // Actualiza el polinomio en cada cambio
  };

  // Realiza la división sintética y encuentra las raíces
  const calcular = () => {
    const log = [];
    const roots = [];
    let currentCoef = [...coeficientes];

    // Aquí asumimos que estamos buscando divisores potenciales (por ejemplo, raíces racionales)
    const posiblesRaices = getPosiblesRaices(currentCoef);

    // Proceso de la división sintética
    posiblesRaices.forEach((raiz) => {
      let coeficientesRestantes = [...currentCoef];
      let multiplicaciones = [];
      let resultados = [];
      let divisor = raiz;

      // Realizamos la división sintética
      let cociente = coeficientesRestantes[0];
      resultados.push(cociente);
      multiplicaciones.push(""); // La primera multiplicación es vacía
      for (let i = 1; i < coeficientesRestantes.length; i++) {
        multiplicaciones.push(divisor * cociente);
        cociente = coeficientesRestantes[i] + multiplicaciones[i];
        resultados.push(cociente);
      }

      if (resultados[resultados.length - 1] === 0) {
        roots.push(raiz); // Se encontró una raíz
        log.push({
          divisor: raiz,
          coeficientes: coeficientesRestantes,
          multiplicaciones: multiplicaciones,
          resultados: resultados,
        });
        currentCoef = resultados.slice(0, resultados.length - 1); // Descarta el residuo
      }
    });

    setLogVisual(log);
    setRaices(roots);
  };

  // Genera las posibles raíces racionales basadas en los coeficientes
  const getPosiblesRaices = (coeficientes) => {
    const posiblesRaices = [];
    const coeficientePrimero = coeficientes[0]; // El primer coeficiente (coeficiente de mayor grado)
    const coeficienteUltimo = coeficientes[coeficientes.length - 1]; // El coeficiente independiente
    // Hallamos los factores del primer y último coeficiente
    const factoresPrimerCoef = obtenerFactores(coeficientePrimero);
    const factoresUltimoCoef = obtenerFactores(coeficienteUltimo);

    // Generamos las posibles raíces dividiendo los factores del último coeficiente entre los factores del primer coeficiente
    factoresUltimoCoef.forEach((factUltimo) => {
      factoresPrimerCoef.forEach((factPrimero) => {
        posiblesRaices.push(factUltimo / factPrimero);
      });
    });

    return posiblesRaices;
  };

  // Función para obtener los factores de un número
  const obtenerFactores = (numero) => {
    const factores = [];
    for (let i = 1; i <= Math.abs(numero); i++) {
      if (numero % i === 0) {
        factores.push(i);
        if (i !== numero / i) factores.push(-i);
      }
    }
    return factores;
  };

  // Limpia los campos y los estados
  const limpiar = () => {
    setGrado("");
    setCoeficientes([]);
    setLogVisual([]);
    setRaices([]);
    setPolinomio("");
  };

  return (
    
    <div className="relative min-h-screen bg-gray-50 flex flex-col items-center py-10">
    {/* Fondo Opulento que ocupa toda la pantalla */}
    <Opulento className="fixed top-0 left-0 w-full h-full z-0" />

    {/* Contenedor principal */}
    <div className="relative z-10 bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl overflow-auto">
      <h1 className="text-2xl font-bold text-blue-600 text-center mb-6">División Sintética</h1>


        {/* Grado del Polinomio */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Grado del Polinomio:
          </label>
          <input
            type="number"
            value={grado}
            onChange={handleGradoChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Introduce el grado del polinomio"
            min="0"
            max="10"
          />
        </div>

        {/* Coeficientes */}
        {grado > 0 && (
          <div className="mb-6">
            <h2 className="text-gray-700 font-medium mb-4">Coeficientes:</h2>
            {coeficientes.map((coef, index) => (
              <div key={index} className="flex items-center mb-2">
                <label className="w-1/3 text-gray-600 font-medium">
                  Coeficiente de x^{grado - index}:
                </label>
                <input
                  type="number"
                  value={coef}
                  onChange={(e) =>
                    handleCoeficienteChange(index, e.target.value)
                  }
                  className="w-2/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        )}

        {/* Botones */}
        <div className="flex justify-between mb-6">
          <button
            onClick={calcular}
            class="bg-sky-950 text-sky-400 border border-sky-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
            <span class="bg-sky-400 shadow-sky-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
            
          
            Calcular
          </button>
         
         
          
<button
onClick={limpiar}
  class="group relative flex h-14 w-14 flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-red-800 bg-red-400 hover:bg-red-600"
>
  <svg
    viewBox="0 0 1.625 1.625"
    class="absolute -top-7 fill-white delay-100 group-hover:top-6 group-hover:animate-[spin_1.4s] group-hover:duration-1000"
    height="15"
    width="15"
  >
    <path
      d="M.471 1.024v-.52a.1.1 0 0 0-.098.098v.618c0 .054.044.098.098.098h.487a.1.1 0 0 0 .098-.099h-.39c-.107 0-.195 0-.195-.195"
    ></path>
    <path
      d="M1.219.601h-.163A.1.1 0 0 1 .959.504V.341A.033.033 0 0 0 .926.309h-.26a.1.1 0 0 0-.098.098v.618c0 .054.044.098.098.098h.487a.1.1 0 0 0 .098-.099v-.39a.033.033 0 0 0-.032-.033"
    ></path>
    <path
      d="m1.245.465-.15-.15a.02.02 0 0 0-.016-.006.023.023 0 0 0-.023.022v.108c0 .036.029.065.065.065h.107a.023.023 0 0 0 .023-.023.02.02 0 0 0-.007-.016"
    ></path>
  </svg>
  <svg
    width="16"
    fill="none"
    viewBox="0 0 39 7"
    class="origin-right duration-500 group-hover:rotate-90"
  >
    <line stroke-width="4" stroke="white" y2="5" x2="39" y1="5"></line>
    <line
      stroke-width="3"
      stroke="white"
      y2="1.5"
      x2="26.0357"
      y1="1.5"
      x1="12"
    ></line>
  </svg>
  <svg width="16" fill="none" viewBox="0 0 33 39" class="">
    <mask fill="white" id="path-1-inside-1_8_19">
      <path
        d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"
      ></path>
    </mask>
    <path
      mask="url(#path-1-inside-1_8_19)"
      fill="white"
      d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
    ></path>
    <path stroke-width="4" stroke="white" d="M12 6L12 29"></path>
    <path stroke-width="4" stroke="white" d="M21 6V29"></path>
  </svg>
</button>

        </div>

        {/* Polinomio Ingresado */}
        

        {/* Resultado */}
        <div className="mb-6">
          <h2 className="text-gray-700 font-medium mb-2">Raíces Encontradas:</h2>
          <p>{raices.length > 0 ? raices.join(", ") : "Ninguna"}</p>
        </div>

        {/* Log de la División Sintética */}
        <div>
          {logVisual.map((logItem, idx) => (
            <div key={idx} className="mb-4">
              <h3 className="font-semibold text-gray-700">
                División con el factor: {logItem.divisor}
              </h3>
              
              <table className="w-full mt-4 border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2">Exponente</th>
                    {logItem.coeficientes.map((_, colIdx) => (
                      <th key={colIdx} className="border border-gray-300 p-2">
                        x^{grado - colIdx}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2">Coeficientes</td>
                    {logItem.coeficientes.map((coef, coefIdx) => (
                      <td key={coefIdx} className="border border-gray-300 p-2">
                        {coef}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">Multiplicación</td>
                    {logItem.multiplicaciones.map((mult, multIdx) => (
                      <td key={multIdx} className="border border-gray-300 p-2">
                        {mult}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">Resultado</td>
                    {logItem.resultados.map((res, resIdx) => (
                      <td
                        key={resIdx}
                        className={`border border-gray-300 p-2 ${
                          resIdx === logItem.resultados.length - 1
                            ? "text-red-500 font-semibold"
                            : ""
                        }`}
                      >
                        {res}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DivisionSintetica;

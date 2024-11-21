import React, { useState } from "react";

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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl">
        <h1 className="text-2xl font-bold text-blue-600 text-center mb-6">
          División Sintética
        </h1>

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
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Calcular
          </button>
          <button
            onClick={limpiar}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Limpiar
          </button>
        </div>

        {/* Polinomio Ingresado */}
        <div className="mb-6">
          <h2 className="text-gray-700 font-medium mb-2">Polinomio Ingresado:</h2>
          <p>{polinomio}</p>
        </div>

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
              <p className="text-gray-600">
                Polinomio actual: {generatePolinomio()}
              </p>
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

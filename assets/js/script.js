let monto = document.querySelector("#monto");
let select = document.querySelector("#select");
let btn = document.querySelector("#btn1");
let p = document.querySelector("#mostrar");
let chart = document.querySelector(".chart");
let myChart;
url = "https://mindicador.cl/api/";

///////Evento para el boton/////
btn.addEventListener("click", () => {
  event.preventDefault();
  let { value: valorMoneda } = monto;
  let { value: valorSelect } = select;

  if (valorMoneda == "") {
    alert("Por favor ingrese el valor a convertir");
  } else {
    if (valorSelect) {
      chart.style.display = "flex";
      chart.style.justifyContent = "center";
      chart.style.alignItems = "center";
      obtenerMonedas(valorMoneda, valorSelect);
    }
  }
});

//////
async function obtenerMonedas(valorMoneda, valorSelect) {
  try {
    let res = await fetch(url + valorSelect);
    let data = await res.json();
    let { serie } = data;
    let renderData = crearData(serie.slice(0, 10).reverse());
    if (myChart) {
      myChart.destroy();
    }
    renderGrafica(renderData);
    let conversion = valorMoneda / serie[0].valor;
    let conversionDecimales = conversion.toFixed(4);
    valorSelect == "dolar"
      ? (p.innerHTML = `Resultado: $${conversionDecimales}`)
      : (p.innerHTML = `Resultado: €${conversionDecimales}`);
  } catch (error) {
    alert(error.message);
  }
}

function renderGrafica(renderData) {
  const config = {
    type: "line",
    data: renderData,
  };

  const ctx = document.getElementById("myChart");
  myChart = new Chart(ctx, config);
}

function crearData(serie) {
  let labels = serie.map(({ fecha }) => formateoFecha(fecha));

  let valorSerie = serie.map(({ valor }) => valor);
  console.log(valorSerie);

  let datasets = [
    {
      label: "Historial últimos 10 días",
      borderColor: "rgb(75, 192, 192)",
      data: valorSerie,
    },
  ];

  return { labels, datasets };
}

function formateoFecha(fecha) {
  date = new Date(fecha);
  let year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();
  return `${year} ${month} ${day}`;
}

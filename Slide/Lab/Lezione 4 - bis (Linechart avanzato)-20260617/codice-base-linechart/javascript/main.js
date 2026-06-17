
window.onload = main;

async function main() {
    let data = await getData();
    let processedData = await preprocessData(data);
    renderData(processedData);
}


async function getData() {
  const csv_path = "../dataset/bitcoin.csv";
  const data = await d3.csv(csv_path);
  console.log(data);
  return data
}

async function preprocessData(data) {
    const dataStringFormat = "%Y-%m-%d"
    const timeParser = d3.timeParse(dataStringFormat);
    return data.map(row => ({
        ...row,
        'date': timeParser(row['date']),
        'value': +row['value']
    }))
}
function createAxisXD3(g, xScale, hChart){
    g.append("g")
        .attr("transform", "translate(0, "+ hChart +")")
        .call(d3.axisBottom(xScale))
}

function createAxisYD3(g, yScale){
    g.append("g")
        .call(d3.axisLeft(yScale))
}
function renderData(data) {
    //dimensioni dell'SVG
    const svg = d3.select("svg");
    const wSvg = svg.attr("width");
    const hSvg = svg.attr("height");

    //margini del grafico
    const margin = {
        top: 40,
        right: 60,
        bottom: 40,
        left: 60
    };

    //dimensioni grafico
    const wChart = wSvg - margin.left - margin.right;
    const hChart = hSvg - margin.top - margin.bottom;


    const gContainer = svg.append("g")
        .attr("transform",
            `translate(${margin.left}, ${margin.top})`)


    const scaleX = d3.scaleTime()
        .domain(d3.extent(data, d=>d.date))
        .range([0, wChart])
        .nice()

    const scaleY = d3.scaleLinear()
        .domain(d3.extent(data, d => d.value))
        .range([hChart, 0])
        .nice()
    /*
    gContainer.append("path")
        .datum(data)
        .attr("fill", "lightskyblue")
        .attr("stroke", "lightskyblue")
        .attr("d", d3.area()
            .x(d => scaleX(d.date))
            .y0(scaleY(0))
            .y1(d => scaleY(d.value)))
    */

    gContainer.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "lightskyblue")
        .attr("d", d3.line()
            .x(d => scaleX(d.date))
            .y(d => scaleY(d.value)))

    createAxisXD3(gContainer, scaleX, hChart);
    createAxisYD3(gContainer, scaleY);
    linechart_tooltip(svg, gContainer, scaleX, scaleY, margin, wChart, hChart)
}


function linechart_tooltip(svg, gContainer, scaleX, scaleY, margin, w_chart, h_chart) {
    /**
     * Esercizio: creare un tooltip che si attiva quando il mouse si muove sopra il grafico (mousemove).
     * 1. Appendere un gruppo all'svg che contiene un rettangolo e due testi (uno per la data e uno per il valore)
     *      - il rettangolo deve essere bianco con bordo nero
     *      - i testi devono essere neri, font-size 10px, dominant-baseline a middle. Font-weight bold per la data
     * P.S. il tooltip deve essere inizialmente invisibile
     *
     * 2. Quando il mouse si muove (mousemove) sul grafico (svg):
     *      - catturare la posizione del mouse (d3.pointer)
     *      - sfruttare l'invert delle scale per passare da px a valori di data e valore.
     *              Fai attenzione che la posizione del mouse è relativa all'svg, mentre le scale sono relative al gContainer (e il gContainer è traslato rispetto all'svg
     *      - aggiorna il contenuto dei due testi con la data e il valore ottenuti al passo precedente
     *      - trasla il gruppo vicino alla posizione del mouse (aggiungi dell'offset per chiarezza)
     *      - mostra il tooltip
     * 3. Quando il mouse esce dal grafico, nascondi il tooltip
     */
    const rect_width = 55, rect_height = 30, rect_x = 0, rect_y = -5;
    const text_x = 5, text1_y = rect_height * (1 / 3) + rect_y, text2_y = rect_height * (2 / 3) + rect_y;


    // Inserisci il codice qui...
}



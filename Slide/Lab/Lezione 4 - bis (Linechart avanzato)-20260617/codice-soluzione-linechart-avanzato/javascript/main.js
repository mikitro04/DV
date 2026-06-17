
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

    // 1 TOOLTIP
    const tooltip = svg.append('g')
        .style('opacity', 0)

    // Rettangolo bianco con bordo nero
    tooltip.append('rect')
        .attr('x', rect_x)
        .attr('y', rect_y)
        .attr('width', rect_width)
        .attr('height', rect_height)
        .attr('fill', 'white')
        .attr('stroke', 'black')

    // Testo che contiene la data
    const dateText = tooltip.append('text')
        .attr('fill', 'black')
        .attr('x', text_x)
        .attr('y', text1_y)
        .style('font-size', '10px')
        .style('font-weight', 'bold')
        .text('')
        .attr('dominant-baseline', 'middle')

    // Testo che contiene il prezzo
    const priceText = tooltip.append('text')
        .attr('fill', 'black')
        .attr('x', text_x)
        .attr('y', text2_y)
        .style('font-size', '10px')
        .text('')
        .attr('dominant-baseline', 'middle')

    // 2
    // Cattura la posizione del mouse sul grafico e usa le scale inverse per ottenere le posizioni x,y per ottenere la data e il valore
    svg.on('mousemove', function (e) {
        // Per fare il rettangolo leggermente spostato rispetto al mouse, altrimenti non si riesce a vedere la posizione del mouse
        const x_offset = 60, y_offset = 30;

        // Ottieni la posizione x,y del mouse. Hint: usa d3.pointer [https://d3js.org/d3-selection/events#pointer]
        const [x, y] = d3.pointer(e);

        // Inverti la x e la y per ottenere i valori originali. Hint: usa scaleX.invert e scaleY.invert [https://d3js.org/d3-scale/linear#linear_invert]
        // Ricordati che l'evento è relativo all'svg, mentre le scale sono relative al gContainer (hanno la stessa origine?)
        const netX = x - margin.left;
        const netY = y - margin.top;
        const date = scaleX.invert(netX);
        const value = scaleY.invert(netY);

        // Assegna le variabili come testo dei text dentro al tooltip
        dateText.text(`${d3.timeFormat('%d-%m-%Y')(date)}`)
        priceText.text(`${d3.format('$.2f')(value)}`)

        // Trasla il tooltip vicino alla posizione del mouse
        tooltip.attr('transform', `translate(${x - x_offset}, ${y - y_offset})`)

        // Mostra il tooltip
        tooltip.style('opacity', 1)

    })
    // Quando il mouse esce dal grafico
    svg.on('mouseout', function (e) {
        // Nascondi il tooltip
        tooltip.style('opacity', 0)
    })
}



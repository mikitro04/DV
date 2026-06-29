window.onload = main;

function main() {
    const data = get_data();
    render_data(data);
}

function get_data() {
    return [
        {name: 'London', population: 8674000},
        {name: 'New York', population: 8406000},
        {name: 'Sydney', population: 4293000},
        {name: 'Paris', population: 2244000},
        {name: 'Beijing', population: 11510000}
    ];
}

function render_data(data) {
    //Definizione dimensioni
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

    const groups = d3.select('#bars') // Modificare
        .data(data)
        .enter().append('g')

    groups.append('rect') // Modificare

    //Testo sinistra => Città
    groups.append('text') // Modificare

    //Testo destra => Popolazione
    groups.append('text') // Modificare

}



window.onload = main;

function main() {
    const data = get_data();
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


    const groups = d3.select('#bars') // Modificare

    groups.append('rect') // Modificare

    //Testo sinistra => Città
    groups.append('text') // Modificare

    //Testo destra => Popolazione
    groups.append('text') // Modificare

}



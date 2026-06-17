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
    const
        h_rect =  19,
        x_rect = 10,
        w_rect = d => d.population * 0.00004,
        y_rect = (_, i) => i * 20;



    const x_left_text = 0;
    const x_right_text = d => w_rect(d) + x_rect;

    const format_population = d3.format('.2s');

    const groups = d3.select('#bars')
        .selectAll('g')
        .data(data)
        .join('g');

    groups.append('rect')
        .attr('height', h_rect)
        .attr('x', x_rect)
        .attr('width', w_rect)
        .attr('y', y_rect);

    //Testo sinistra => Città
    groups.append('text')
        .attr('x', x_left_text)
        .attr('y', y_rect)
        .text(d => d.name)
        .style('text-anchor', 'end')
        .style('alignment-baseline', 'text-before-edge');

    //Testo destra => Popolazione
    groups.append('text')
        .attr('x', x_right_text)
        .attr('y', y_rect)
        .style('alignment-baseline', 'text-before-edge')
        .text(d => format_population(d.population.toString()));

}



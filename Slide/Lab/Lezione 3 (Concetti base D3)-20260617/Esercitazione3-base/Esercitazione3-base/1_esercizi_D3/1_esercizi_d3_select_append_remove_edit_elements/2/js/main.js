window.onload = main;

function main() {
    /**
     * Esercizio 0 - Selezionare testi diversi e assegnargli il testo "D3 in Depth selection example":
     * I selettori sono:
     * A) il primo elemento con classe "intro"
     * B) tutti gli elementi con classe "intro"
     * C) tutti gli elementi con classe "intro" che sono discendenti del body
     */
    // TODO Write here // A
    d3.select('.intro')
      .text("Primo paragrafo Intro")
    // TODO Write here // B
    d3.selectAll('.intro')
        .text("Altri paragrafi Intro")
    // TODO Write here // C
    d3.selectAll('body .intro')
        .text("Paragrafo Intro dentro Body")
    // TODO change text to "D3 in Depth selection example"

    /** Esericizio 1 - Seleziona tutti i cerchi
     * e cambia il loro raggio a 20 */
    // TODO Write here
    d3.selectAll("circle").attr("r", 20);

    /** Esercizio 2 - Seleziona il primo cerchio
     * e cambia il suo colore a "orange" */
    // TODO Write here
    d3.select("circle").attr("fill", 'orange');


    /** Esercizio 3 - Seleziona la checkbox con id "myCheck"
     * e cambia il suo stile accent-color a "red"
     *  e spuntala (property checked a true) */
    // TODO Write here
    d3.select("#myCheck").style("accent-color", "red").property("checked", true)
}
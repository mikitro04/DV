window.onload = main;

const get_radius = (idx) => 10 * (idx + 1);

function main() {
    const eEsercizio0 = false;

    if (eEsercizio0)
        esercizio0();
    else
        esercizio1();
}

/**
 * Esercizio 0:
 * A) Seleziona tutti  i cerchi (tag 'circle')
 * 2) e cambiane il colore di riempimento in arancione ('orange').
 * C) Cambia anche il raggio di tutti i cerchi in base al loro indice.
 * Fallo senza sfruttare la chainability di d3.
 */
function esercizio0() {
    // A)
    // TODO Write here
    const c = d3.selectAll("circle");

    // B
    // TODO Write here
    c.attr('fill', 'orange');

    // C
    // TODO Write here
    c.attr("r", function (_, i) {
        let r = (i+1)*10;
        return r;
    })
}

/**
 * Esercizio 1:
 * Fai esercizio0 sfruttando la chainability di d3.
 */
function esercizio1() {
    // TODO Write here
    d3.selectAll("circle")
        .attr("fill", "orange")
        .attr("r", function (_, i) {
            let r = (i+1)*10;
            return r;
        });
}
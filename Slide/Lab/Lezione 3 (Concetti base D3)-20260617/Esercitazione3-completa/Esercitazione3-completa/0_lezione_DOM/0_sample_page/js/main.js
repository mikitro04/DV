window.onload = main;

function main() {
    DOM()
}

function DOM() {
    // The Document Object Model (DOM) is a programming interface for web documents.
    // It represents the page so that programs can change the document structure, style, and content.
    // The DOM represents the document as nodes and objects.
    // This allows programming languages to connect to the page.


    // Get the first text element and log it to the console.
    const first_text = document.querySelector("text");
    console.log("The first text:", first_text);

    // Get all the text elements and log them to the console.
    const all_texts = document.querySelectorAll("text");
    console.log("All texts:", all_texts);

    // Get the first element with the class "small" and log it to the console.
    const first_classed_small = document.querySelector(".small");
    console.log("The first .small:", first_classed_small);

    // Get all the elements with the class "small" and log them to the console.
    const all_classed_small = document.querySelectorAll(".small");
    console.log("All .small:", all_classed_small);

    // Get the first text contained in a group and log it to the console.
    const first_text_inside_group = document.querySelector("g text");
    console.log("first \"g text\":", first_text_inside_group);

    // Get all the texts groups contained inside a group and log them to the console.
    const all_text_inside_groups = document.querySelectorAll("g text");
    console.log("all \"g text\":", all_text_inside_groups);

    // Change the text to "Hello World".
    first_text.textContent = "Hello World. I\"m not \"My\" anymore";
    // all_texts.forEach(p => p.textContent  = "Hello World");

    // Create a new element with the tag "rect" and append it to the first group (you have to select it).
    const svgNS = "http://www.w3.org/2000/svg";

    const rec = document.createElementNS(svgNS ,'rect');
    rec.setAttribute('width', "40");
    rec.setAttribute('height', "40");
    rec.setAttribute('x', "50");
    rec.setAttribute('y', "240");
    rec.setAttribute('fill', 'black');
    rec.setAttribute('id', 'niceRec');
    document.querySelector('g').appendChild(rec);

    // Add an event listener to the element with the id "newP" that when hovered changes the color of p in red.
    rec.addEventListener("mouseover", () => {
        rec.setAttribute('fill', 'red');
    });
    // Now add the event listener that restores the color to black when the mouse leaves the element.
    rec.addEventListener("mouseleave", () => {
        rec.setAttribute('fill', 'blue');
    });
}



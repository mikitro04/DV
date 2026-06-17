window.onload = main;

function main(){
    tree();
}

async function getDataJSON(path){
    const data = await d3.json(path);
    console.log(data);
    return data;
}

async function tree(){
    let data = await getDataJSON('../datasets/tree.json');
    const idSVG = "alberoSVG";
    //console.log(data)
    renderTree(data, idSVG);

}

function renderTree(data, idSVG) {
    const svg = d3.select("#" + idSVG);
    const svgHeight = svg.attr('height');
    const svgWidth = svg.attr('width');

    const margin = {top: 40, right: 40, bottom: 40, left: 100}
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;

    const gContainer = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)



}



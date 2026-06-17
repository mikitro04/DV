window.onload = main;

function main(){
    graph();
}

async function getDataJSON(path){
    const data = await d3.json(path);
    console.log(data);
    return data;
}

async function graph(){
    let data = await getDataJSON('../datasets/graph.json');
    //x, y
    const nodesPositions = [
        [340, 115],
        [340, 455],
        [502, 338],
        [178, 338],
        [440, 423],
        [240, 423],
        [178, 232],
        [240, 147],
        [440, 147],
        [502, 232],
    ]

    const idSVG = "grafoSVG";
    renderGraphStatic(data, idSVG, nodesPositions);

}

function renderGraphStatic(data, idSVG, nodesPositions) {
    const svg = d3.select("#" + idSVG);
    const svgHeight = svg.attr('height');
    const svgWidth = svg.attr('width');

    const margin = {top: 40, right: 50, bottom: 40, left: 120}
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;

}



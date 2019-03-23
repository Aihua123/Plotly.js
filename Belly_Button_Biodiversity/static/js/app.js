function init() {
    var selector = d3.select("#selDataset");
    d3.json("/names").then((sampleNames) => {
        sampleNames.forEach(sample => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        })
        const firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
};

function optionChanged(newSample) {
    buildCharts(newSample);
    buildMetadata(newSample);
};

function buildCharts(sample) {
    let url = `/samples/${sample}`
    d3.json(url).then(data => {
        let values = data.sample_values;
        let labels = data.otu_ids;
        let hovertext = data.otu_labels;
        console.log(values)

        var trace1 = {
            labels: labels.slice(0, 10),
            values: values.slice(0, 10),
            text: hovertext.slice(0, 10),
            textinfo: "percent",
            type: 'pie'
        };

        var data = [trace1];

        var layout = {
            textposition: 'inside',
            height: 500,
            width: 600
        };

        Plotly.newPlot("pie", data, layout);

        var trace2 = {
            x: labels,
            y: values,
            text: hovertext,
            mode: 'markers',
            marker: {
                color:labels,
                colorscale: "Portland",
                size: values
            }
        }
        var data2 = [trace2];

        var layout = {
            // showlegend: false,
            height: 600,
            width: 1200
        };

        Plotly.newPlot('bubble', data2, layout);

    })
}

function buildMetadata(sample) {
    d3.json(`/metadata/${sample}`).then(data => {
        d3.select("#sample-metadata").html("");
        var selecor = d3.select("#sample-metadata");
        Object.entries(data).forEach(x => {
            selecor.append('p').text(`${x[0].toUpperCase()}: ${x[1]}`)
        })
    })
}
init();



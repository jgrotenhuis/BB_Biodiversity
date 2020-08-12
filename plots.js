function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    var sample = sampleNames[0];
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);

    });
    buildMetadata(sample);
    buildCharts(sample);
})}
init();

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");
    PANEL.append("h6").text("ID: " + result.id + "\n");
    PANEL.append("h6").text("ETHNICITY: " + result.ethnicity + "\n");
    PANEL.append("h6").text("GENDER: " + result.gender + "\n");
    PANEL.append("h6").text("AGE: " + result.age + "\n");
    PANEL.append("h6").text("LOCATION: " + result.location + "\n");
    PANEL.append("h6").text("BBTYPE: " + result.bbtype + "\n");
    PANEL.append("h6").text("WFREQ: " + result.wfreq + "\n");
  });
}

function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var otu_ids = result.otu_ids

    var sample_values = result.sample_values
    var top_10 = sample_values.slice(0, 10)
    var otu_labels = result.otu_labels
    
    var metadata = data.metadata;

    var bar_trace = [ {
      x: top_10,
      y: result,
      type: "bar",
      orientation: 'h',
      text: otu_labels
    } ];
    var bar_layout = {
      yaxis: {autorange:'reversed'}
    };
    Plotly.newPlot("bar", bar_trace, bar_layout);

    // var gauge_trace = {
    //   value: [wfreq],
    //   title: { text: "Belly Button Washing Frequency\n Scrubs Per Week"},
    //   type: "indicator",
    //   showarrow: "False"
    // };
    // Plotly.newPlot("gauge", gauge_trace);

    var bubble_trace = {
      x: otu_ids,
      y: sample_values,
      mode: "markers",
      text: otu_labels,
      marker: {
        size: sample_values,
        color: otu_ids
      }
    };

    var bubble_data = [bubble_trace];

    Plotly.newPlot("markers", bubble_data);

  });
}

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
};
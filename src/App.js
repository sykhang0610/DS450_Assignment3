import React, { Component } from "react";
import "./App.css";
import * as d3 from "d3"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { wordFrequency: [] };
  }
  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate() {
    this.renderChart();
  }

  getWordFrequency = (text) => {
    const stopWords = new Set(["the", "and", "a", "an", "in", "on", "at", "for", "with", "about", "as", "by", "to", "of", "from", "that", "which", "who", "whom", "this", "these", "those", "it", "its", "they", "their", "them", "we", "our", "ours", "you", "your", "yours", "he", "him", "his", "she", "her", "hers", "it", "its", "we", "us", "our", "ours", "they", "them", "theirs", "I", "me", "my", "myself", "you", "your", "yourself", "yourselves", "was", "were", "is", "am", "are", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the", "as", "if", "each", "how", "which", "who", "whom", "what", "this", "these", "those", "that", "with", "without", "through", "over", "under", "above", "below", "between", "among", "during", "before", "after", "until", "while", "of", "for", "on", "off", "out", "in", "into", "by", "about", "against", "with", "amongst", "throughout", "despite", "towards", "upon", "isn't", "aren't", "wasn't", "weren't", "haven't", "hasn't", "hadn't", "doesn't", "didn't", "don't", "doesn't", "didn't", "won't", "wouldn't", "can't", "couldn't", "shouldn't", "mustn't", "needn't", "daren't", "hasn't", "haven't", "hadn't"]);
    const words = text.toLowerCase().replace(/[.,/#!$%^&*;:{}=_`~()]/g, "").replace(/\s{2,}/g, " ").split(" ");
    const filteredWords = words.filter(word => !stopWords.has(word));
    return Object.entries(filteredWords.reduce((freq, word) => {
      freq[word] = (freq[word] || 0) + 1;
      return freq;
    }, {}));
  }


  renderChart() {
    // Top 5 words by frequency
    const data = this.state.wordFrequency
      .slice()
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word, freq]) => ({ word, freq }));

    const svg = d3.select(".svg_parent");
    const width = 1000;
    const height = 300;

    svg.attr("width", width).attr("height", height);

    // // Clear if no data
    // if (data.length === 0) {
    //   svg.selectAll("text.word").remove();
    //   return;
    // }

    // ---- scales ----
    const [minF, maxF] = d3.extent(data, d => d.freq);
    const fontScale = d3.scaleLinear()
      .domain([minF ?? 1, maxF ?? 1])
      .range([20, 80]);

    // Even spacing across the width
    const xScale = d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([150, width - 150]);

    // Single horizontal line
    const y = height / 2;

    // Add positions
    const positioned = data.map((d, i) => ({
      ...d,
      x: xScale(i),
      y
    }));

    // ---- D3 join with animation ----
    svg.selectAll("text.word")
      .data(positioned, d => d.word)
      .join(
        // ENTER
        enter => enter
          .append("text")
          .attr("class", "word")
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .attr("x", d => d.x)
          .attr("y", d => d.y)
          .style("font-size", "0px")
          .text(d => d.word)
          .transition()
          .duration(2000)
          .delay((d, i) => i * 500)
          .attr("opacity", 1)
          .style("font-size", d => `${fontScale(d.freq)}px`),

        // UPDATE
        update => update
          .transition()
          .duration(2000)
          .attr("x", d => d.x)
          .attr("y", d => d.y)
          .style("font-size", d => `${fontScale(d.freq)}px`)
          .text(d => d.word),

      // EXIT
      exit => exit
          .transition()
          .duration(500)
          .attr("opacity", 0)
          .style("font-size", "0px")
          .remove()
      );
  }

  render() {
    return (
      <div className="parent">
        <div className="child1" style={{ width: 1000 }}>
          <textarea type="text" id="input_field" style={{ height: 150, width: 1000 }} />
          <button type="submit" value="Generate Matrix" style={{ marginTop: 10, height: 40, width: 1000 }} onClick={() => {
            var input_data = document.getElementById("input_field").value
            this.setState({ wordFrequency: this.getWordFrequency(input_data) })
          }}
          > Generate WordCloud</button>
        </div>
        <div className="child2"><svg className="svg_parent"></svg></div>
      </div>
    );
  }
}

export default App;

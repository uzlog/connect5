import React, { Component } from 'react';
import * as d3 from 'd3';
import { colors } from './constants';
import { wrapText } from './helpers';

class SubGroupChart extends Component {
  componentDidMount() {
    const { title, i, k, j, legends, dataset } = this.props;
    const barWidth = 30;
    const chartWidth = dataset.length * barWidth;
    const margin = { top: 40, right: 10, bottom: 0, left: 10 };
    // chartWidth = chartWidth > 150 ? chartWidth : 150;
    const chartHeight = 250;

    const bandScale = d3
      .scaleBand()
      .domain(legends)
      .range([0, chartWidth]);

    // for bars colors
    const ordinalScale = d3
      .scaleOrdinal()
      .domain(legends)
      .range(colors.slice(0, legends.length));

    const yScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([0, chartHeight - margin.top - margin.bottom]);

    const svg = d3
      .select(`#chart-sub-groups-${k}-${i}-${j}`)
      .append('svg')
      .attr('width', chartWidth)
      .attr('height', chartHeight)
      .attr('style', 'display: block; margin: 25px auto 0');

    // bars groups
    const groups = svg
      .selectAll(`.chart-sub-groups-${k}-${i}-${j}-g`)
      .data(dataset)
      .enter()
      .append('g')
      .attr('class', `chart-sub-groups-${k}-${i}-${j}-g`);

    // empty bars
    groups
      .append('rect')
      .attr('width', bandScale.bandwidth())
      .attr('x', d => bandScale(d.category || d.surveyType))
      .attr('height', chartHeight - margin.top - margin.bottom)
      .attr('y', margin.top)
      .attr('fill', 'none')
      .attr('stroke', '#F2F2F2')
      .attr('stroke-width', 2);

    // filled bars
    groups
      .append('rect')
      .attr('width', bandScale.bandwidth())
      .attr('x', d => bandScale(d.category || d.surveyType))
      .attr('height', d => yScale(d.value > 100 ? 100 : 100))
      .attr('y', d => chartHeight - yScale(d.value > 100 ? 100 : d.value))
      .attr('fill', d => ordinalScale(d.category || d.surveyType));

    // red lines
    groups
      .append('line')
      .attr('stroke', d => (d.value && d.average ? `red` : 'none'))
      .attr('stroke-width', 1)
      .attr('x1', d => bandScale(d.category || d.surveyType))
      .attr('y1', d => chartHeight - yScale(d.average))
      .attr(
        'x2',
        d => bandScale(d.category || d.surveyType) + bandScale.bandwidth()
      )
      .attr('y2', d => chartHeight - yScale(d.average));

    // no data text
    groups
      .append('text')
      .text('No data yet')
      .attr('fill', '#828282')
      .attr('opacity', d => (d.value ? 0 : 0.7))
      .attr(
        'x',
        d => bandScale(d.category || d.surveyType) + bandScale.bandwidth() / 2
      )
      .attr('y', (chartHeight - margin.top - margin.bottom) / 2)
      .attr('writing-mode', 'tb')
      .attr('text-anchor', 'end')
      .attr(
        'transform',
        d =>
          `rotate(180 ${bandScale(d.category || d.surveyType) +
            bandScale.bandwidth() / 2}, ${(chartHeight -
            margin.top -
            margin.bottom) /
            2})`
      );

    svg
      .selectAll(`.chart-sub-groups-${k}-${i}-text`)
      .data(dataset)
      .enter()
      .append('text')
      .text(d => `${Math.round(d.value)}%`)
      .attr('class', `chart-sub-groups-${k}-${i}-${j}-text`)
      .attr('text-anchor', 'middle')
      .attr('opacity', d => (d.value * 0.8) / 100 + 0.2)
      .attr(
        'x',
        d => bandScale(d.category || d.surveyType) + bandScale.bandwidth() / 2
      )
      .attr('y', margin.top / 2)
      .attr('writing-mode', 'tb')
      .attr('text-anchor', 'middle')
      .attr(
        'transform',
        d =>
          `rotate(180 ${bandScale(d.category || d.surveyType) +
            bandScale.bandwidth() / 2}, ${margin.top / 2 - 2})`
      );

    const svg2 = d3
      .select(`#chart-sub-groups-${k}-${i}-${j}`)
      .append('svg')
      .attr('width', 150)
      .attr('height', 50)
      .attr('style', 'display: block; margin: 0 auto');

    svg2
      .selectAll(`.chart-sub-groups-${k}-${i}-title`)
      .data([title])
      .enter()
      .append('text')
      .text(d => d)
      .attr('text-anchor', 'middle')
      .attr('x', 150 / 2)
      .attr('y', 25)
      .attr('width', 150)
      .attr('height', 25)
      .call(wrapText, 150);
  }

  render() {
    const { i, k, j } = this.props;

    return (
      <>
        <div
          id={`chart-sub-groups-${k}-${i}-${j}`}
          style={{ minWidth: '220px', margin: '0 auto' }}
        ></div>
      </>
    );
  }
}

export default SubGroupChart;

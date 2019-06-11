/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
import React, { Component } from 'react';
import { Chart, HorizontalBar } from 'react-chartjs-2';
import { Alert, Spin } from 'antd';

import { connect } from 'react-redux';

import { fetchbehavioralInsight as fetchbehavioralInsightAction } from '../../../actions/behavioralInsight';

import {
  Wrapper,
  ChartWrapper,
  Description,
  Title,
  ContentWrapper,
  WhiteWrapper,
} from './BehavioralInsight.style';

function drawBarValues() {
  // render the value of the chart above the bar
  const { ctx } = this.chart;
  ctx.font = Chart.helpers.fontString(
    Chart.defaults.global.defaultFontSize,
    'normal',
    Chart.defaults.global.defaultFontFamily
  );
  ctx.fillStyle = this.chart.config.options.defaultFontColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'center';
  this.data.datasets.forEach(function(dataset) {
    for (let i = 0; i < dataset.data.length; i += 1) {
      if (
        !dataset.hidden === true ||
        dataset._meta[Object.keys(dataset._meta)[0]].hidden !== false
      ) {
        const model =
          dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;
        if (dataset.data[i] !== null) {
          ctx.fillText(dataset.data[i], model.x - 10, model.y + 20);
        }
      }
    }
  });
}

class BehavioralTrainerResults extends Component {
  componentDidMount() {
    const { trainerId, fetchbehavioralInsight } = this.props;

    fetchbehavioralInsight(`/api/behavioral-insight/trainer/${trainerId}`);
  }

  render() {
    const { data, loaded } = this.props;

    return (
      <Wrapper>
        <ContentWrapper>
          {loaded ? (
            <>
              <Title>
                Behaviour is influenced by our perceptions of our capability,
                opportunity and motivation for that behaviour
              </Title>

              {Object.keys(data).length ? (
                Object.entries(data).map(pairOfArray => (
                  <ChartWrapper key={pairOfArray[0]}>
                    <WhiteWrapper>
                      <Description>{pairOfArray[0]}</Description>
                      <HorizontalBar
                        width={25}
                        height={15}
                        data={{
                          layout: {
                            padding: {
                              top: 5,
                              left: 15,
                              right: 15,
                              bottom: 15,
                            },
                          },
                          responsive: true,
                          labels: Object.keys(pairOfArray[1]),
                          type: 'horizontalBar',
                          datasets: [
                            {
                              backgroundColor: [
                                '#3e95cd',
                                '#8e5ea2',
                                '#3cba9f',
                                '#e8c3b9',
                                '#c45850',
                              ],
                              data: Object.values(pairOfArray[1]),
                            },
                          ],
                        }}
                        options={{
                          responsive: 1,
                          animation: {
                            onProgress: drawBarValues,
                            onComplete: drawBarValues,
                          },
                          hover: { animationDuration: 0 },

                          showAllTooltips: true,
                          legend: {
                            display: false,
                          },

                          scales: {
                            xAxes: [
                              {
                                gridLines: {
                                  offsetGridLines: true,
                                  display: false,
                                },

                                ticks: {
                                  beginAtZero: true,
                                  steps: 2,
                                  stepValue: 5,
                                  max: 100,
                                },
                              },
                            ],
                            yAxes: [
                              {
                                barPercentage: 1,
                                barThickness: 20,
                                gridLines: {
                                  offsetGridLines: true,
                                  display: false,
                                },
                                ticks: {
                                  beginAtZero: true,
                                  steps: 2,
                                  stepValue: 5,
                                  max: 100,
                                },
                              },
                            ],
                          },
                          offsetGridLines: true,
                        }}
                      />
                    </WhiteWrapper>
                  </ChartWrapper>
                ))
              ) : (
                <div style={{ margin: '10px auto', maxWidth: '270px' }}>
                  <Alert
                    message="No data collected yet"
                    type="warning"
                    showIcon
                  />
                </div>
              )}
            </>
          ) : (
            <Spin style={{ width: '100%', padding: '40px' }} />
          )}
        </ContentWrapper>
      </Wrapper>
    );
  }
}

const mapStateToProps = state => ({
  data: state.behavioralInsight.data,
  loaded: state.behavioralInsight.loaded,
});

export default connect(
  mapStateToProps,
  { fetchbehavioralInsight: fetchbehavioralInsightAction }
)(BehavioralTrainerResults);

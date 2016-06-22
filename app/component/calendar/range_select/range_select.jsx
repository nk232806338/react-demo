import React from 'react';
const moment = require('moment');
require('moment-range');
const CalendarBase = require('../calendar_base.jsx');

const RangeCalendar = React.createClass({
  displayName: 'RangeCalendar',
  propTypes: {
    rangeType: React.PropTypes.string,
    selectedDates: React.PropTypes.array,
    onFinishTempSelect: React.PropTypes.func,
  },
  getInitialState() {
    const { selectedDates, ...others } = this.props;
    this.passByPrps = others;
    return {
      selectedDates,
      tempSelectedDates: [],
      rangeType: this.props.rangeType,
    };
  },
  componentWillReceiveProps(next) {
    this.setState({
      selectedDates: next.selectedDates,
      tempSelectedDates: next.tempSelectedDates,
      rangeType: next.rangeType,
    });
    if (next.clearSelect) {
      this.startDate = null;
    }
  },
  cellClickHandler(target) {
    if (this.startDate) {
      if (target.className.indexOf('rdtNew') > 0 || target.className.indexOf('rdtOld') > 0) {
        return;
      }
      this.startDate = null;
      if (this.props.onFinishTempSelect) {
        this.props.onFinishTempSelect(this.state.tempSelectedDates);
      }
    } else {
      this.startDate = moment(target.getAttribute('data-date'));
      this.setState({
        tempSelectedDates: [moment(target.getAttribute('data-date'))],
      });
    }
  },
  cellMouseOverHandler(target) {
    if (this.startDate) {
      const eventTargetDate = moment(target.getAttribute('data-date'));
      let range = [];
      if (eventTargetDate.isBefore(this.startDate)) {
        range = moment.range(eventTargetDate, this.startDate).toArray('days');
      } else {
        range = moment.range(this.startDate, eventTargetDate).toArray('days');
      }
      this.setState({
        tempSelectedDates: range,
      });
    }
  },
  render() {
    return (
      <div>
        <div className="range-rdt">
          <CalendarBase
            {...this.passByPrps}
            selectedDates={this.state.selectedDates}
            tempSelectedDates={this.state.tempSelectedDates}
            cellClickHandler={this.cellClickHandler}
            cellMouseOverHandler={this.cellMouseOverHandler}
            viewMode={this.state.rangeType === 'MONTH' ? 'months' : 'days'}
          />
        </div>
      </div>
    );
  },
});

module.exports = RangeCalendar;

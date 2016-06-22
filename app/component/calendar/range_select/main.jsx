import React from 'react';
const moment = require('moment');
require('moment-range');
const RangeCalendar = require('./range_select.jsx');
const QuickSelect = require('./quick_select.jsx');
const TYPES = React.PropTypes;

const RANGE_TYPE = {
  DAY: 'DAY',
  MONTH: 'MONTH',
};

const RangeSelectCalendar = React.createClass({
  displayName: 'RangeSelectCalendar',
  propTypes: {
    onSubmit: TYPES.func,
    selectedDates: TYPES.any,
    notAllowSelected: TYPES.any,
    children: TYPES.any,
  },
  getInitialState() {
    const { selectedDates, ...others } = this.props;
    this.passByPrps = others;
    return {
      rangeType: RANGE_TYPE.DAY,
      selectedDates,
      tempSelectedDates: [],
      inputValue: this.getStartAndEnd(selectedDates),
      open: true,
    };
  },
  onSubmit() {
    let nextState = {
      quickSelectType: null,
      open: false,
      inputValue: this.getStartAndEnd(this.selectedItems),
      selectedDates: this.selectedItems,
    };
    this.setState(nextState);
    if (this.props.onSubmit) this.props.onSubmit(this.selectedItems);
  },
  onFocus() {
    this.setState({
      open: true,
    });
  },
  onFinishTempSelect(selectedItems) {
    this.selectedItems = selectedItems;
  },
  getStartAndEnd(selectedDates) {
    if (selectedDates.length > 1) {
      let data = {
        start: moment(selectedDates[0], 'YYYY-MM-DD').format('YYYY-MM-DD'),
        end: moment(selectedDates[selectedDates.length - 1], 'YYYY-MM-DD').format('YYYY-MM-DD'),
      };
      return `${data.start}---${data.end}`;
    }
    return moment(selectedDates[0], 'YYYY-MM-DD').format('YYYY-MM-DD');
  },
  handleQuickSelect(quickSelectedDate) {
    this.setState({
      rangeType: RANGE_TYPE.DAY,
      selectedDates: quickSelectedDate,
      tempSelectedDates: [],
      clearSelect: true,
    });
  },
  render() {
    const { inputValue, selectedDates, tempSelectedDates, rangeType } = this.state;
    return (
      <div>
        {this.props.children ? <input type="text" {...this.props.children.props} value={inputValue} onFocus={this.onFocus} /> : null}
        {
          this.state.open ?
            <div className="range-rdt">
              <RangeCalendar
                {...this.props} rangeType={rangeType} clearSelect selectedDates={selectedDates}
                onFinishTempSelect={this.onFinishTempSelect} tempSelectedDates={tempSelectedDates}
              />
              <aside>
                <nav>
                  <ul>
                    <li
                      className={rangeType === RANGE_TYPE.DAY ? 'active' : ''}
                      onClick={event => this.setState({ rangeType: RANGE_TYPE.DAY })}
                    >
                      <a>日</a>
                    </li>
                    <li
                      className={rangeType === RANGE_TYPE.MONTH ? 'active' : ''}
                      onClick={event => this.setState({ rangeType: RANGE_TYPE.MONTH })}
                    >
                      <a>月</a>
                    </li>
                  </ul>
                </nav>
                <QuickSelect handleQuickSelect={this.handleQuickSelect} />
              </aside>
              <a className="rdt-btn-confirm" onClick={this.onSubmit} >确认</a>
            </div> : null
        }
      </div>
    );
  },
});

module.exports = RangeSelectCalendar;

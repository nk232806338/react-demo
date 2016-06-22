import React from 'react';
const moment = require('moment');
require('moment-range');
const TYPES = React.PropTypes;
const QUICK_START = {
  TODAY: 1,
  TOMORROW: 2,
  THIS_WEEK: 3,
  LAST_WEEK: 4,
  THIS_MONTH: 5,
  FROM_BEGIN_TO_NOW: 6,
};

const QuickSelect = React.createClass({
  displayName: 'QuickSelect',
  propTypes: {
    handleQuickSelect: TYPES.func,
    fromBegin: TYPES.any,
  },
  getInitialState() {
    return {
      quickSelectType: null,
    };
  },
  quickSelect(quickSelectType) {
    let quickSelectedDate = null;
    let theDayOfLastWeek = moment().subtract(1, 'weeks');
    let lastWeek = moment.range(theDayOfLastWeek.clone().startOf('week'), theDayOfLastWeek.clone().endOf('week')).toArray('days');
    switch (quickSelectType) {
      case QUICK_START.TODAY:
        quickSelectedDate = [moment()];
        break;
      case QUICK_START.TOMORROW:
        quickSelectedDate = [moment().subtract(1, 'days')];
        break;
      case QUICK_START.THIS_WEEK:
        quickSelectedDate = moment.range(moment().startOf('week'), moment().endOf('week')).toArray('days');
        break;
      case QUICK_START.LAST_WEEK:
        quickSelectedDate = lastWeek;
        break;
      case QUICK_START.THIS_MONTH:
        quickSelectedDate = moment.range(moment().startOf('month'), moment().endOf('month')).toArray('days');
        break;
      case QUICK_START.FROM_BEGIN_TO_NOW:
        quickSelectedDate = moment.range(moment(this.props.fromBegin), moment()).toArray('days');
        break;
      default:
        return;
    }
    this.props.handleQuickSelect(quickSelectedDate);
    this.setState({
      quickSelectType,
    });
  },
  render() {
    const quickSelectType = this.state.quickSelectType;
    return (
      <ul className="fast-select">
        <li
          className={quickSelectType === QUICK_START.TODAY ? 'active' : ''}
          onClick={event => this.quickSelect(QUICK_START.TODAY)}
        >
          <a>今天</a>
        </li>
        <li
          className={quickSelectType === QUICK_START.TOMORROW ? 'active' : ''}
          onClick={event => this.quickSelect(QUICK_START.TOMORROW)}
        >
          <a>昨天</a>
        </li>
        {this.props.fromBegin ?
          <li
            className={quickSelectType === QUICK_START.FROM_BEGIN_TO_NOW ? 'active' : ''}
            onClick={event => this.quickSelect(QUICK_START.FROM_BEGIN_TO_NOW)}
          >
            <a>起始--至今</a>
          </li>
          : null}
        <li
          className={quickSelectType === QUICK_START.THIS_WEEK ? 'active' : ''}
          onClick={event => this.quickSelect(QUICK_START.THIS_WEEK)}
        >
          <a>本周</a>
        </li>
        <li
          className={quickSelectType === QUICK_START.LAST_WEEK ? 'active' : ''}
          onClick={event => this.quickSelect(QUICK_START.LAST_WEEK)}
        >
          <a>上周</a>
        </li>
        <li
          className={quickSelectType === QUICK_START.THIS_MONTH ? 'active' : ''}
          onClick={event => this.quickSelect(QUICK_START.THIS_MONTH)}
        >
          <a>本月</a>
        </li>
      </ul>
    );
  },
});

module.exports = QuickSelect;

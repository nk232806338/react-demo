const React = require('react');
const DaysView = require('./days_view.jsx');
const MonthsView = require('./months_view.jsx');
const YearsView = require('./years_view.jsx');
const moment = require('moment');
require('./react-datetime.scss');
moment.locale('zh-cn');
const TYPES = React.PropTypes;
const Calendar = React.createClass({
  displayName: 'Calendar',
  propTypes: {
    // value: TYPES.object | TYPES.string,
    // defaultValue: TYPES.object | TYPES.string,
    className: TYPES.string,
    closeOnSelect: TYPES.bool,
    onFocus: TYPES.func,
    onBlur: TYPES.func,
    onChange: TYPES.func,
    locale: TYPES.string,
    // dateFormat: TYPES.string | TYPES.bool,
    // timeFormat: TYPES.string | TYPES.bool,
    selectedDates: TYPES.array, // the dates what usr had selected
    tempSelectedDates: TYPES.array, // reaction by user click(select begin)-->hover(selecting)-->click(select end)
    inputProps: TYPES.object,
    viewMode: TYPES.oneOf(['years', 'months', 'days']),
    open: TYPES.bool,
    strictParsing: TYPES.bool,
    notAllowSelected: TYPES.any,
    cellClickHandler: TYPES.func,
    cellMouseOverHandler: TYPES.func,
    input: TYPES.any,
  },
  getDefaultProps() {
    const nof = function nof() {};
    return {
      className: '',
      viewMode: 'days',
      inputProps: {},
      input: true,
      onFocus: nof,
      onBlur: nof,
      onChange: nof,
      timeFormat: false,
      dateFormat: true,
      strictParsing: true,
      selectedDates: [],
      notAllowSelected: null,
    };
  },
  getInitialState() {
    const state = this.getStateFromProps(this.props);
    if (state.open === undefined) {
      state.open = !this.props.input;
    }
    this.currentView = this.props.viewMode || 'days';
    return state;
  },
  componentWillReceiveProps(nextProps) {
    const formats = this.getFormats(nextProps);
    const update = this.getStateFromProps(nextProps);
    if (formats.datetime !== this.getFormats(this.props).datetime) {
      update.inputFormat = formats.datetime;
    }
    this.setState(update);
  },
  setDate(type) {
    const me = this;
    const nextViews = {
      month: 'days',
      year: 'months',
    };
    return function setDate(e) {
      const setValue = me.state.viewDate.clone()[type](parseInt(e.target.getAttribute('data-value'), 10)).startOf(type);
      me.viewDate = setValue;
      me.setState({
        viewDate: setValue,
      });
      me.currentView = nextViews[type];
    };
  },
  getStateFromProps(props) {
    let selectedDates = props.selectedDates;
    const viewDate = this.localMoment().startOf('month');
    selectedDates = selectedDates.map(date => this.localMoment(date));
    this.currentView = props.viewMode || 'days';
    return {
      viewDate: props.viewDate || this.viewDate || viewDate,
      selectedDates,
      open: props.open !== undefined ? props.open : this.state && this.state.open,
    };
  },
  getComponentProps() {
    const formats = this.getFormats(this.props);
    const props = { dateFormat: formats.date, timeFormat: formats.time };
    this.componentProps.fromProps.forEach(name => { props[name] = this.props[name]; });
    this.componentProps.fromState.forEach(name => { props[name] = this.state[name]; });
    this.componentProps.fromThis.forEach(name => { props[name] = this[name]; });
    return props;
  },
  getFormats(props) {
    const formats = {
      date: props.dateFormat || '',
      time: props.timeFormat || '',
    };
    const locale = this.localMoment(props.date).localeData();
    if (formats.date === true) {
      formats.date = locale.longDateFormat('L');
    }
    if (formats.time === true) {
      formats.time = locale.longDateFormat('LT');
    }
    formats.datetime = formats.date && formats.time ?
      `${formats.date} ${formats.time}` :
    formats.date || formats.time;
    return formats;
  },
  componentProps: {
    fromProps: ['value', 'renderDay', 'renderMonth', 'renderYear', 'tempSelectedDates', 'cellClickHandler', 'cellMouseOverHandler'],
    fromState: ['viewDate', 'selectedDates'],
    fromThis: ['setDate', 'isValidDate', 'showView', 'addTime', 'subtractTime', 'updateSelectedDate', 'localMoment'],
  },
  localMoment(date, format) {
    const m = moment(date, format, this.props.strictParsing);
    if (this.props.locale) {
      m.locale(this.props.locale);
    }
    return m;
  },
  openCalendar() {
    if (!this.state.open) {
      this.props.onFocus();
      this.setState({ open: true });
    }
  },
  closeCalendar() {
    this.setState({ open: false });
  },
  updateSelectedDate(e, close) {
    const target = e.target;
    const viewDate = this.state.viewDate;
    // const currentDate = this.state.selectedViewDate || viewDate;
    let modifier = 0;
    const date = viewDate.clone()
      .month(viewDate.month() + modifier)
      .date(parseInt(target.getAttribute('data-value'), 10));
    if (target.className.indexOf('rdtNew') !== -1) {
      modifier = 1;
    } else if (target.className.indexOf('rdtOld') !== -1) {
      modifier = -1;
    }
    this.viewDate = date.clone().startOf('month');
    this.setState({
      viewDate: date.clone().startOf('month'),
    }, function closeCalendar() {
      if (this.props.closeOnSelect && close) {
        this.closeCalendar();
      }
    });
  },
  addTime(amount, type, toSelected) {
    return this.updateTime('add', amount, type, toSelected);
  },
  subtractTime(amount, type, toSelected) {
    return this.updateTime('subtract', amount, type, toSelected);
  },
  updateTime(op, amount, type, toSelected) {
    const me = this;
    return function updateTime() {
      const update = {};
      const date = toSelected ? 'selectedDate' : 'viewDate';
      update[date] = me.state[date].clone()[op](amount, type);
      // prevent viewDate change by props change
      me.viewDate = update.viewDate;
      if (me.props.viewDateChange) {
        me.props.viewDateChange(me.viewDate);
      }
      me.setState(update);
    };
  },
  showView(view) {
    const me = this;
    return function showView(e) {
      me.currentView = view;
      me.setState({
        currentView: view,
      });
    };
  },
  /**
   * @desc [
   *    验证传入日期是否可选
   *    根据props的notAllowSelected来判断,接受2种验证类型
   *    (1)Array 在数组中的元素都不可在日历中编辑
   *    (2)Object 此配置对象若生效需要同时指定 value & type 属性
   *          value: 需要 ]
   * @param date
   * @returns {boolean}
   */
  isValidDate(date) {
    const notAllowSelected = this.props.notAllowSelected;
    if (!notAllowSelected) return true;
    if (Object.prototype.toString.call(notAllowSelected) === '[object Array]') {
      let allow = true;
      notAllowSelected.forEach(notAllow => {
        if (this.localMoment(notAllow).isSame(date)) {
          allow = false;
        }
      });
      return allow;
    }
    if (Object.prototype.toString.call(notAllowSelected) === '[object Object]') {
      let validate = true;
      const before = notAllowSelected.before;
      const after = notAllowSelected.after;
      if (before && after && this.localMoment(before).isAfter(this.localMoment(after))) {
        if (date.isAfter(this.localMoment(before)) || date.isBefore(this.localMoment(after))) {
          return false;
        }
      }
      if (before && this.localMoment(before).isValid()) {
        if (date.isBefore(this.localMoment(before))) {
          validate = false;
        }
      }
      if (after && this.localMoment(after).isValid()) {
        if (date.isAfter(this.localMoment(after))) {
          validate = false;
        }
      }
      return validate;
    }
    return true;
  },
  viewComponents: {
    days: DaysView,
    months: MonthsView,
    years: YearsView,
  },
  render() {
    const Component = this.viewComponents[this.currentView];
    let className = `rdt ${this.props.className}`;
    if (this.state.open) {
      className += ' rdtOpen';
    }
    return (<div className={className}>
      <div className="rdtPicker" key="dt">
        <Component {...this.getComponentProps()} />
      </div>
    </div>);
  },
});

module.exports = Calendar;

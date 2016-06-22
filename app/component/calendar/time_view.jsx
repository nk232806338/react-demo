const React = require('react');
const DOM = React.DOM;
const DateTimePickerTime = React.createClass({
  displayName: 'DateTimePickerTime',
  propTypes: {
    selectedDate: React.PropTypes.any,
    viewDate: React.PropTypes.any,
    setTime: React.PropTypes.func,
    dateFormat: React.PropTypes.any,
    showView: React.PropTypes.func,
    timeFormat: React.PropTypes.any,
  },
  getInitialState() {
    return this.calculateState(this.props);
  },
  componentWillReceiveProps(nextProps, nextState) {
    this.setState(this.calculateState(nextProps));
  },
  onStartClicking(action, type) {
    let me = this;
    return function startClick() {
      let update = {};
      update[type] = me[action](type);
      me.setState(update);

      me.timer = setTimeout(() => {
        me.increaseTimer = setInterval(() => {
          update[type] = me[action](type);
          me.setState(update);
        }, 70);
      }, 500);

      me.mouseUpListener = function mouseUpListener() {
        clearTimeout(me.timer);
        clearInterval(me.increaseTimer);
        me.props.setTime(type, me.state[type]);
        document.body.removeEventListener('mouseup', me.mouseUpListener);
      };

      document.body.addEventListener('mouseup', me.mouseUpListener);
    };
  },
  maxValues: {
    hours: 23,
    minutes: 59,
    seconds: 59,
    milliseconds: 999,
  },
  padValues: {
    hours: 1,
    minutes: 2,
    seconds: 2,
    milliseconds: 3,
  },
  increase(type) {
    let value = parseInt(this.state[type], 10) + 1;
    if (value > this.maxValues[type]) {
      value = 0;
    }
    return this.pad(type, value);
  },
  decrease(type) {
    let value = parseInt(this.state[type], 10) - 1;
    if (value < 0) {
      value = this.maxValues[type];
    }
    return this.pad(type, value);
  },
  pad(type, value) {
    let str = `${value}`;
    while (str.length < this.padValues[type]) {
      str = `0${str}`;
    }
    return str;
  },
  calculateState(props) {
    const date = props.selectedDate || props.viewDate;
    const format = props.timeFormat;
    const counters = [];
    if (format.indexOf('H') !== -1 || format.indexOf('h') !== -1) {
      counters.push('hours');
      if (format.indexOf('m') !== -1) {
        counters.push('minutes');
        if (format.indexOf('s') !== -1) {
          counters.push('seconds');
        }
      }
    }
    return {
      hours: date.format('H'),
      minutes: date.format('mm'),
      seconds: date.format('ss'),
      milliseconds: date.format('SSS'),
      counters,
    };
  },
  updateMilli(e) {
    const milli = parseInt(e.target.value, 10);
    if (milli === e.target.value && milli >= 0 && milli < 1000) {
      this.props.setTime('milliseconds', milli);
      this.setState({ milliseconds: milli });
    }
  },
  renderCounter(type) {
    return DOM.div({ key: type, className: 'rdtCounter' }, [
      DOM.button({ key:'up', className: 'rdtBtn', onMouseDown: this.onStartClicking('increase', type), type: 'button' }, '▲'),
      DOM.div({ key:'c', className: 'rdtCount' }, this.state[type]),
      DOM.button({ key:'do', className: 'rdtBtn', onMouseDown: this.onStartClicking('decrease', type), type: 'button' }, '▼'),
    ]);
  },
  renderHeader() {
    const date = this.props.selectedDate || this.props.viewDate;
    return DOM.thead({ key: 'h' }, DOM.tr({},
      DOM.th({ className: 'rdtSwitch', colSpan: 4, onClick: this.props.showView('days') }, date.format(this.props.dateFormat))
    ));
  },
  render() {
    let me = this;
    let counters = [];
    this.state.counters.forEach(c => {
      if (counters.length) {
        counters.push(DOM.div({ key: `sep${counters.length}`, className: 'rdtCounterSeparator' }, ':'));
      }
      counters.push(me.renderCounter(c));
    });
    if (this.state.counters.length === 3 && this.props.timeFormat.indexOf('S') !== -1) {
      counters.push(DOM.div({ className: 'rdtCounterSeparator', key: 'sep5' }, ':'));
      counters.push(
        DOM.div({ className: 'rdtCounter rdtMilli', key:'m' },
          DOM.input({ value: this.state.milliseconds, type: 'text', onChange: this.updateMilli })
        )
      );
    }
    return DOM.div({ className: 'rdtTime' },
      DOM.table({}, [
        this.renderHeader(),
        DOM.tbody({ key: 'b' }, DOM.tr({}, DOM.td({},
          DOM.div({ className: 'rdtCounters' }, counters)
        ))),
      ])
    );
  },
});

module.exports = DateTimePickerTime;

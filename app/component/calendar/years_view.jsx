const React = require('react');
const DOM = React.DOM;
const DateTimePickerYears = React.createClass({
  displayName: 'DateTimePickerYears',
  propTypes: {
    renderYear: React.PropTypes.func,
    selectedDate: React.PropTypes.any,
    setDate: React.PropTypes.func,
    viewDate: React.PropTypes.any,
    subtractTime: React.PropTypes.func,
    addTime: React.PropTypes.func,
    showView: React.PropTypes.func,
  },
  renderYears(year) {
    let years = [];
    let i = -1;
    let rows = [];
    let renderer = this.props.renderYear || this.renderYear;
    let selectedDate = this.props.selectedDate;
    let classes;
    let props;
    year--;
    while (i < 11) {
      classes = 'rdtYear';
      if (i === -1 | i === 10) {
        classes += ' rdtOld';
      }
      if (selectedDate && selectedDate.year() === year) {
        classes += ' rdtActive';
      }
      props = {
        key: year,
        'data-value': year,
        className: classes,
        onClick: this.props.setDate('year'),
      };
      years.push(renderer(props, year, selectedDate && selectedDate.clone()));
      if (years.length === 4) {
        rows.push(DOM.tr({ key: i }, years));
        years = [];
      }
      year++;
      i++;
    }
    return rows;
  },
  renderYear(props, year, selectedDate) {
    return DOM.td(props, year);
  },
  render() {
    const year = parseInt(this.props.viewDate.year() / 10, 10) * 10;

    return DOM.div({ className: 'rdtYears' }, [
      DOM.table({ key: 'a' }, DOM.thead({}, DOM.tr({}, [
        DOM.th({ key: 'prev', className: 'rdtPrev' },
          DOM.button({ onClick: this.props.subtractTime(10, 'years'), type: 'button' }, '‹')),
        DOM.th({ key: 'year', className: 'rdtSwitch',
          onClick: this.props.showView('years'), colSpan: 2 }, `${year}'-'${year + 9}`),
        DOM.th({ key: 'next', className: 'rdtNext' },
          DOM.button({ onClick: this.props.addTime(10, 'years'), type: 'button' }, '›')),
      ]))),
      DOM.table({ key: 'years' }, DOM.tbody({}, this.renderYears(year))),
    ]);
  },
});

module.exports = DateTimePickerYears;

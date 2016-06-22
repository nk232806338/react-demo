const React = require('react');
const moment = require('moment');
const DOM = React.DOM;
const DateTimePickerMonths = React.createClass({
  displayName: 'DateTimePickerMonths',
  propTypes: {
    viewDate: React.PropTypes.any,
    renderMonth: React.PropTypes.func,
    tempSelectedDates: React.PropTypes.any,
    cellClickHandler: React.PropTypes.func,
    setDate: React.PropTypes.func,
    addTime: React.PropTypes.func,
    cellMouseOverHandler: React.PropTypes.func,
    subtractTime: React.PropTypes.func,
    showView: React.PropTypes.func,
    selectedDates: React.PropTypes.any,
  },
  renderMonths() {
    let month = this.props.viewDate.month();
    let year = this.props.viewDate.year();
    let rows = [];
    let i = 0;
    let months = [];
    let renderer = this.props.renderMonth || this.renderMonth;
    let classes;
    let props;
    while (i < 12) {
      classes = 'rdtMonth';
      let setClasses = '';
      let data = [];
      if (this.props.tempSelectedDates && this.props.tempSelectedDates.length > 0) {
        data = this.props.tempSelectedDates;
      } else {
        data = this.props.selectedDates;
      }
      if (data) {
        for (let j = 0; j < data.length; j++) {
          let dateMoment = moment(data[j]);
          if (dateMoment && i === dateMoment.month() && year === dateMoment.year()) {
            setClasses = ' rdtActive';
          }
        }
      }
      classes += setClasses;
      props = {
        key: i,
        'data-value': i,
        'data-date': moment().year(year).month(i).
          format('YYYY-MM'),
        className: classes,
        onClick: (event) => {
          if (this.props.cellClickHandler) {
            this.props.cellClickHandler(event.target);
          } else {
            this.props.setDate('month')(event);
          }
        },
        onMouseOver: (event) => {
          if (this.props.cellMouseOverHandler) {
            this.props.cellMouseOverHandler(event.target);
          }
        },
      };
      months.push(renderer(props, i, year));
      if (months.length === 4) {
        rows.push(DOM.tr({ key: `${month}_${rows.length}` }, months));
        months = [];
      }
      i++;
    }
    return rows;
  },
  renderMonth(props, month, year, selectedDate) {
    return DOM.td(props, this.props.viewDate.localeData()._monthsShort[month]);
  },
  render() {
    return DOM.div({ className: 'rdtMonths' }, [
      DOM.table({ key: 'a' }, DOM.thead({}, DOM.tr({}, [
        DOM.th({ key: 'prev', className: 'rdtPrev' },
          DOM.button({ onClick: this.props.subtractTime(1, 'years'), type: 'button' }, '‹')
        ),
        DOM.th(
          { key: 'year', className: 'rdtSwitch',
            onClick: this.props.showView('years'),
            colSpan: 2, 'data-value': this.props.viewDate.year(),
          },
          this.props.viewDate.year()
        ),
        DOM.th({ key: 'next', className: 'rdtNext' },
          DOM.button({ onClick: this.props.addTime(1, 'years'), type: 'button' }, '›')),
      ]))),
      DOM.table({ key: 'months' }, DOM.tbody({ key: 'b' }, this.renderMonths())),
    ]);
  },
});

module.exports = DateTimePickerMonths;

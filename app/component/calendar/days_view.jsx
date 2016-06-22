const React = require('react');
const moment = require('moment');
const DOM = React.DOM;
const DateTimePickerDays = React.createClass({
  displayName: 'DateTimePickerDays',
	/**
	 * Get a list of the days of the week
	 * depending on the current locale
	 * @return {array} A list with the shortname of the days
	 */
  propTypes: {
    viewDate: React.PropTypes.any,
    selectedDates: React.PropTypes.any,
    tempSelectedDates: React.PropTypes.any,
    renderDay: React.PropTypes.any,
    isValidDate: React.PropTypes.any,
    updateSelectedDate: React.PropTypes.func,
    cellClickHandler: React.PropTypes.func,
    cellMouseOverHandler: React.PropTypes.func,
    subtractTime: React.PropTypes.func,
    addTime: React.PropTypes.func,
    showView: React.PropTypes.func,
  },
  getDaysOfWeek(locale) {
    return locale._weekdaysMin;
  },
  isValidDate() { return 1; },
  dayMouseOverHandler(event) {
    const { cellMouseOverHandler } = this.props;
    if (cellMouseOverHandler) {
      cellMouseOverHandler(event.target);
    }
  },
  dayClickHandler(event) {
    this.props.updateSelectedDate(event, true);
    this.props.cellClickHandler(event.target);
  },
  renderDay(props, currentDate) {
    return DOM.td(props, currentDate.date());
  },
  renderDays() {
    let date = this.props.viewDate;
    let selectedDates = this.props.selectedDates;
    let	tempSelectedDates = this.props.tempSelectedDates;
    let	prevMonth = date.clone().subtract(1, 'months');
    let	currentYear = date.year();
    let	currentMonth = date.month();
    let	weeks = [];
    let	days = [];
    let	renderer = this.props.renderDay || this.renderDay;
    let	isValid = this.props.isValidDate || this.isValidDate;
    let	classes;
    let currentDate;
    let disabled;
    let dayProps;
    // Go to the last week of the previous month
    // 从上个月的周一开始渲染 day cell
    prevMonth.date(prevMonth.daysInMonth()).startOf('week').subtract(1, 'days');
    let lastDay = prevMonth.clone().add(42, 'd');
    while (prevMonth.isBefore(lastDay)) {
      classes = 'rdtDay';
      currentDate = prevMonth.clone();

      if ((prevMonth.year() === currentYear && prevMonth.month() < currentMonth) || (prevMonth.year() < currentYear)) {
        classes += ' rdtOld';
      } else if ((prevMonth.year() === currentYear && prevMonth.month() > currentMonth) || (prevMonth.year() > currentYear)) {
        classes += ' rdtNew';
      }
      // when user is in the process of hover(selecting..),
      // the start&&end date's className should be 'rdtActive'
      // and the within dates 's className should be 'rdtWithin'
      if (tempSelectedDates && tempSelectedDates.length > 0) {
        if (prevMonth.isSame(tempSelectedDates[0]) || prevMonth.isSame(tempSelectedDates[tempSelectedDates.length - 1])) {
          classes += ' rdtActive';
        }
        if (moment().range(tempSelectedDates[1], tempSelectedDates[tempSelectedDates.length - 2]).contains(prevMonth)) {
          classes += ' rdtWithin';
        }
      } else {
        /**
         * Here we calculate if current date is active,
         * in the reason of the selectedDate may be a very long array.
         * and consider about the performance, if the length of the array is more than 100,
         * we could think it's not necessary to care of the active date may be discrete
         * So, we use "contains" instead of looping the whole array to find if "isSame".
         */
        if (selectedDates && selectedDates.length < 100) {
          for (let i = 0; i < selectedDates.length; i++) {
            if (selectedDates[i] && prevMonth.isSame(selectedDates[i], 'day')) {
              classes += ' rdtActive';
            }
          }
        } else {
          if (moment().range(selectedDates[0], selectedDates[selectedDates.length - 1]).contains(prevMonth)) {
            classes += ' rdtActive';
          }
        }
      }
      if (prevMonth.isSame(moment(), 'day')) {
        classes += ' rdtToday';
      }
      disabled = !isValid(prevMonth);
      if (disabled) {
        classes += ' rdtDisabled';
      }
      dayProps = {
        key: prevMonth.format('M_D'),
        'data-value': prevMonth.date(),
        'data-date': prevMonth.format(),
        className: classes,
      };
      if (!disabled) {
        dayProps.onClick = this.dayClickHandler;
        dayProps.onMouseOver = this.dayMouseOverHandler;
      }
      days.push(renderer(dayProps, currentDate));
      if (days.length === 7) {
        weeks.push(DOM.tr({ key: prevMonth.format('M_D') }, days));
        days = [];
      }
      prevMonth.add(1, 'd');
    }
    return weeks;
  },
  render() {
    let date = this.props.viewDate;
    let locale = date.localeData();
    const tableChildren = [
      DOM.thead({ key: 'th' }, [
        DOM.tr({ key: 'h' }, [
          DOM.th({ key: 'p', className: 'rdtPrev' },
            DOM.button({ onClick: this.props.subtractTime(1, 'months'), type: 'button' }, '‹')
          ),
          DOM.th({ key: 's', className: 'rdtSwitch',
            onClick: this.props.showView('months'), colSpan: 5,
            'data-value': this.props.viewDate.month() }, `${locale.months(date)} ${date.year()}`
          ),
          DOM.th({ key: 'n', className: 'rdtNext' }, DOM.button({ onClick: this.props.addTime(1, 'months'), type: 'button' }, '›')),
        ]),
        DOM.tr({ key: 'd' }, this.getDaysOfWeek(locale).map((day, index) => DOM.th({ key: day + index, className: 'dow' }, day))),
      ]),
      DOM.tbody({ key: 'tb' }, this.renderDays()),
    ];
    return (<div className="rdtDays">
      {DOM.table({ cellSpacing: 0 }, tableChildren)}
    </div>);
  },
});

module.exports = DateTimePickerDays;

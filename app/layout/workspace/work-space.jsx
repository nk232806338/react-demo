var React = require('react');
var Select = require('./../../component/select.jsx');
var _ = require('underscore');
require('./work-space.scss');
var data_level_0 = [
  {name: '家用电器', id: 0},
  {name: '养生', id: 1},
  {name: '服饰', id: 2},
  {name: '运动', id: 3},
  {name: '商品', id: 4}
];

var data_level_1 = [
  {name: '冰箱', id: 111, parentId: 0},
  {name: '彩电', id: 112, parentId: 0},
  {name: '洗衣机', id: 113, parentId: 0},
  {name: '保健品', id: 114, parentId: 1},
  {name: '柒牌男装', id: 115, parentId: 2},
  {name: 'nike', id: 116, parentId: 3},
];

var data_level_2 = [
  {name: '海尔冰箱', id: 1111, parentId: 111},
  {name: 'TCL冰箱', id: 1112, parentId: 111},
  {name: '小天鹅冰箱', id: 1113, parentId: 111},
  {name: 'sony彩电', id: 1121, parentId: 112},
  {name: '乐视', id: 1122, parentId: 112},
  {name: '联想', id: 1123, parentId: 112},
];

var WorkSpace = React.createClass({
  displayName: 'app',
  getInitialState() {
    return {
      data_level_0: data_level_0,
      data_level_1: [],
      data_level_2: [],
    }
  },
  componentDidMount() {
    data_level_0[0].active = true;
    this.handleFirstLevelClick(data_level_0[0].id);
  },
  handleFirstLevelClick(id) {
    // debugger;
    this.setState({
      data_level_1: _.filter(data_level_1, item => item.parentId == id),
    });
  },
  handleSecondLevelClick(id) {
    this.setState({
      data_level_2: _.filter(data_level_2, item => item.parentId == id),
    });

  },
  handleThirdLevelClick(id) {

  },
  render() {
    var {data_level_0, data_level_1, data_level_2} = this.state;
    return (<div className="work-space">
      <Select data={data_level_0} title="一级分类" onSelect={this.handleFirstLevelClick}/>
      <Select data={data_level_1} title="二级分类" onSelect={this.handleSecondLevelClick}/>
      <Select data={data_level_2} title="三级分类" onSelect={this.handleThirdLevelClick}/>
    </div>);
  },
});

module.exports = WorkSpace;
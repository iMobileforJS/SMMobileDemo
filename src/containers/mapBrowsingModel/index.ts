/**
 * 地图浏览界面组件的入口文件
 * 
 * 作用：
 *   继承redux里的属性和方法
 *   将组件导出
 */
import { connect } from 'react-redux';
import MapBrowsingView from './MapBrowsingView';
import { RootState } from '@/redux/types';

// 从redux里继承的属性
const mapStateToProps = (state: RootState) => ({
  // 横竖屏切换的相关数据
  device: state.device.toJS(),
})

// 从redux里继承的方法
const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapBrowsingView);
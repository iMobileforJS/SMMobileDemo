import { connect } from 'react-redux';
import MapView from './MapView';
import { RootState } from '@/redux/types';

// 从redux里继承的属性
const mapStateToProps = (state: RootState) => ({
  // map: state.map.toJS(),
  // 横竖屏切换的相关数据
  device: state.device.toJS(),
})
// 从redux里继承的方法
const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapView);

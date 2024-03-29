/** 地图导航界面的入口文件 */
import { connect } from 'react-redux';
import NavigationView from './NavigationView';
import { openMap } from '@/redux/reducers/map';
import { getLayers } from '@/redux/reducers/layers';
import { RootState } from '@/redux/types';

const mapStateToProps = (state: RootState) => ({
  map: state.map.toJS(),
  device: state.device.toJS(),
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavigationView);
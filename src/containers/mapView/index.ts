import { connect } from 'react-redux';
import MapView from './MapView';
import { openMap } from '@/redux/reducers/map';
import { RootState } from '@/redux/types';

const mapStateToProps = (state: RootState) => ({
  map: state.map.toJS(),
  device: state.device.toJS(),
})

const mapDispatchToProps = {
  openMap,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapView);

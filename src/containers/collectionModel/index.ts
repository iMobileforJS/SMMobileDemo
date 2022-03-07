import { connect } from 'react-redux';
import CollectionView from './CollectionView';
import { openMap } from '@/redux/reducers/map';
import { getLayers } from '@/redux/reducers/layers';
import { RootState } from '@/redux/types';

const mapStateToProps = (state: RootState) => ({
  map: state.map.toJS(),
  device: state.device.toJS(),
})

const mapDispatchToProps = {
  openMap,
  getLayers,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CollectionView);
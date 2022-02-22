import { combineReducers } from 'redux'
import map from './map'
import device from './device'
import histories from './histories'
import layers from './layers'

export default combineReducers({
  map,
  device,
  histories,
  layers,
})
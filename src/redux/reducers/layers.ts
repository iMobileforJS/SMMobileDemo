import { fromJS } from 'immutable'
import { handleActions } from 'redux-actions'
import { SMap } from 'imobile_for_reactnative'
// Constants
// --------------------------------------------------
export const SET_EDIT_LAYER = 'SET_EDIT_LAYER'
export const SET_SELECTION = 'SET_SELECTION'
export const SET_CURRENT_LAYER = 'SET_CURRENT_LAYER'
export const GET_LAYERS = 'GET_LAYERS'
// Actions
// --------------------------------------------------

export const setEditLayer = (params: SMap.LayerInfo, cb = () => {}) => async (dispatch: (arg0: { type: string; payload: SMap.LayerInfo }) => any) => {
  if (params && params.path) {
    await SMap.setLayerEditable(params.path, true)
  }
  await dispatch({
    type: SET_EDIT_LAYER,
    payload: params || {},
  })
  cb && cb()
}

export const setSelection = (params: any, cb = () => {}) => async (dispatch: (arg0: { type: string; payload: any }) => any) => {
  await dispatch({
    type: SET_SELECTION,
    payload: params || [],
  })
  cb && cb()
}

export const setCurrentLayer = (params: SMap.LayerInfo) => async (dispatch: (arg0: { type: string; payload: SMap.LayerInfo }) => any) => {
  if (params && params.path) {
    !params.isVisible && await SMap.setLayerVisible(params.path, true)
    // await SMap.setLayerEditable(params.path, true)
  }
  await dispatch({
    type: SET_CURRENT_LAYER,
    payload: params || {},
  })
}

export const getLayers = (params?: number | {type: number, currentLayerIndex: number}) => async (dispatch: (arg0: { type: string; payload: { layers: SMap.LayerInfo[]; currentLayerIndex: number } }) => any) => {
  if (typeof params === 'number') {
    params = {
      type: params,
      currentLayerIndex: -1,
    }
  } else {
    params = {
      type: params?.type !== undefined && params?.type >= 0 ? params?.type : -1,
      currentLayerIndex: params?.currentLayerIndex || -1,
    }
  }
  const layers = await SMap.getLayersByType(params.type)
  await dispatch({
    type: GET_LAYERS,
    payload:
      {
        layers,
        currentLayerIndex: params.currentLayerIndex,
      } || {},
  })
  return layers
}

const initialState = fromJS({
  layers: [],
  selection: [],
  currentLayer: {},
})

export default handleActions(
  {
    [`${SET_EDIT_LAYER}`]: (state, { payload }) =>
      state.setIn(['editLayer'], fromJS(payload)),
    [`${SET_SELECTION}`]: (state, { payload }) =>
      state.setIn(['selection'], fromJS(payload)),
    [`${SET_CURRENT_LAYER}`]: (state, { payload }) =>
      state.setIn(['currentLayer'], fromJS(payload)),
    [`${GET_LAYERS}`]: (state, { payload }) => {
      let currentLayer
      const currentLayerIndex = payload.currentLayerIndex || -1
      if (currentLayerIndex >= 0 && payload.layers.length > currentLayerIndex) {
        currentLayer = payload.layers[currentLayerIndex]
      }
      if (currentLayer) {
        state.setIn(['currentLayer'], fromJS(currentLayer))
      }
      return state.setIn(['layers'], fromJS(payload.layers))
    },
    // [REHYDRATE]: () => {
    //   // return payload && payload.layers ? fromJS(payload.layers) : state
    //   return initialState
    // },
  },
  initialState,
)

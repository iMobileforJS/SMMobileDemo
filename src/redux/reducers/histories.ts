import { fromJS } from 'immutable'
import { REHYDRATE } from 'redux-persist'
import { handleActions } from 'redux-actions'
import { ModelUtils } from '@/utils'

export const MAP_SEARCH_HISTORY = 'MAP_SEARCH_HISTORY'

export const setMapSearchHistory = (
  data: PoiHistory[] = [],
  cb = () => {},
) => async (dispatch: (arg0: { type: string; payload: PoiHistory[] }) => any) => {
  await dispatch({
    type: MAP_SEARCH_HISTORY,
    payload: data,
  })
  cb && cb()
}

const initialState = fromJS({
  // 二维搜索历史
  mapSearchHistory: [],
})

export default handleActions(
  {
    [`${MAP_SEARCH_HISTORY}`]: (state: any, { payload }: { payload: PoiHistory[] }) => {
      let data = state.toJS().mapSearchHistory
      if (payload) {
        data = payload
      } else {
        data = []
      }
      return state.setIn(['mapSearchHistory'], fromJS(data))
    },
    [REHYDRATE]: (state, { payload }) =>
      ModelUtils.checkModel(state, payload && payload.histories),
  },
  initialState,
)

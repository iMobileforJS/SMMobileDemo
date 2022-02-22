import { fromJS } from 'immutable'
import { handleActions } from 'redux-actions'
import { screen } from '../../utils'
// Constants
// --------------------------------------------------
export const SHOW_SET = 'SHOW_SET'

// export interface DEVICE {
//   orientation: string,
//   width: number,
//   height: number,
//   safeWidth: number,
//   safeHeight: number,
// }
// Actions
// ---------------------------------.3-----------------

// 横竖屏切换，使用
export const setShow = (params: {orientation: string}, cb = () => {}) => async dispatch => {
  screen.setOrientation(params.orientation)
  await dispatch({
    type: SHOW_SET,
    payload: params,
  })
  cb && cb()
}

const initialState = fromJS({
  orientation:
    screen.deviceHeight > screen.deviceWidth ? 'PORTRAIT' : 'LANDSCAPE',
  width: screen.getScreenWidth(),
  height: screen.getScreenHeight(),
  safeWidth: screen.getScreenSafeWidth(),
  safeHeight: screen.getScreenSafeHeight(),
})

export default handleActions(
  {
    [`${SHOW_SET}`]: (state: any, { payload }: { payload: {orientation: string}}) => {
      const device = state.toJS()
      device.width = screen.getScreenWidth(payload.orientation)
      device.height = screen.getScreenHeight(payload.orientation)
      device.safeWidth = screen.getScreenSafeWidth(payload.orientation)
      device.safeHeight = screen.getScreenSafeHeight(payload.orientation)
      device.orientation = payload.orientation
      return fromJS(device)
    },
    // [REHYDRATE]: (state, { payload }) => {
    //   return payload && payload.device ? fromJS(payload.device) : state
    // },
  },
  initialState,
)

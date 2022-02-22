import { ThunkAction } from "redux-thunk"
import { fromJS } from 'immutable'
import { handleActions } from 'redux-actions'
import { RootState } from "../types"
import { SMap, RNFS as fs, FileTools } from 'imobile_for_reactnative'
import { ConstPath, DEFAULT_USER_NAME } from "@/constants"

export const OPEN_MAP = 'OPEN_MAP'

export interface MapInfo {
  name: string,
  path: string,
}

export interface OpenMapAction {
  type: typeof OPEN_MAP,
  payload: MapInfo,
}

export interface MapState {
  maps: Array<MapInfo>,
  currentMap: any,
}

export const openMap = (
  params: MapInfo
): ThunkAction<Promise<MapInfo | undefined>, RootState, unknown, OpenMapAction> => async dispatch => {
  try {
    // if (
    //   params === null ||
    //   params === undefined ||
    //   (!params.name) ||
    //   !params.path
    // )
    //   return
    const absolutePath = await FileTools.appendingHomeDirectory(params.path)
    const module = ''
    const fileName = params.name
    const isCustomerPath = params.path.indexOf(ConstPath.CustomerPath) >= 0
    const importResult = await SMap.openMapName(fileName, {
      Module: module,
      IsPrivate: !isCustomerPath,
    })
    const expFilePath = `${absolutePath.substr(
      0,
      absolutePath.lastIndexOf('.'),
    )}.exp`
    const openMapResult = importResult && (await SMap.openMap(fileName))
    const currentMapInfo = await SMap.getMapInfo()
    if (openMapResult) {
      const expIsExist = await FileTools.fileIsExist(expFilePath)
      if (expIsExist) {
        const data = await fs.readFile(expFilePath)
        const mapInfo: MapInfo = Object.assign(currentMapInfo, JSON.parse(data), { path: params.path })
        await dispatch({
          type: OPEN_MAP,
          payload: params || {},
        })

        return mapInfo
      }
    } else {
      return undefined
    }
  } catch (e) {
    return undefined
  }
}

const initState: MapState = {
  maps: [],
  currentMap: {},
}

const initialState = fromJS(initState)

// export default (state = initState, payload: any): any => {
//   switch(payload.type) {
//     case OPEN_MAP : {
//       return {
//         ...state,
//         maps: payload.mapInfo,
//       }
//     }
//     default:
//       return state
//   }
// }
export default handleActions(
  {
    [`${OPEN_MAP}`]: (state: any, { payload }: { payload: MapInfo}) => {
      const { mapInfo } = state.toJS()
      return state.setIn(['mapInfo'], fromJS(payload))
    },
    // [REHYDRATE]: (state, { payload }) => {
    //   return payload && payload.device ? fromJS(payload.device) : state
    // },
  },
  initialState,
)
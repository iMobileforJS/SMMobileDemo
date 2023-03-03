import { SMap } from "imobile_for_reactnative"
import { DatasetType } from "imobile_for_reactnative/NativeModule/interfaces/data/SData"

const baseMapsOrigin = [
  'roadmap@GoogleMaps',
  'satellite@GoogleMaps',
  'terrain@GoogleMaps',
  'hybrid@GoogleMaps',
  'labelmap@GoogleMaps',
  // 'vec@TD',
  // 'cva@TDWZ',
  // 'img@TDYXM',
  'TrafficMap@BaiduMap',
  'Standard@OpenStreetMaps',
  'CycleMap@OpenStreetMaps',
  'TransportMap@OpenStreetMaps',
  'quanguo@SuperMapCloud',
  'roadmap_cn@bingMap',
  'baseMap',
  'vec@tianditu',
  'cva@tiandituCN',
  'eva@tiandituEN',
  'img@tiandituImg',
  'cia@tiandituImgCN',
  'eia@tiandituImgEN',
  'ter@tiandituTer',
  'cta@tiandituTerCN',
  'roadmap@GaoDeMap',
  'satellite@GaoDeMap',
]
let baseMaps = [...baseMapsOrigin]
function isBaseLayer(layer: SMap.LayerInfo) {
  try {
    let name = layer.name
    for (let i = 0, n = baseMaps.length; i < n; i++) {
      if (name.toUpperCase().indexOf(baseMaps[i].toUpperCase()) >= 0) {
        if (
          layer.type === DatasetType.IMAGE ||
          layer.type === DatasetType.MBImage
        ) {
          return true
        }
      }
    }
    return false
  } catch (e) {
    // debugger
    return false
  }
}

export default {
  isBaseLayer,
}
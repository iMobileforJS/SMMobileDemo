import Assets from './assetsIndex'

function getAssets(): typeof Assets {
  let asset = require('./assetsIndex').default
  return asset
}

export {
  getAssets,
}
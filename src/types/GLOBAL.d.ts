/**
 * 声明全局GLOBAL
 */
declare namespace GLOBAL {
  /** 语言 */
  let language: string
  // 全局方法
  /** 获取设备信息，待优化 App.js*/
  function getDevice(): Device
}
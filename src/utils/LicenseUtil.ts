/**
 * 许可相关功能的文件
 * 
 * 功能：
 *   getLicenseType： 获取当前许可类型
 *   activateLicense：激活离线许可
 *   reloadLocalLicense： 重新加载已激活的离线许可
 *   loginCloudLicense：登录云许可
 *   queryCloudLicense：查询云许可
 *   applyCloudTrialLicense：激活云许可
 *   recycleLicense：归还许可
 *   logoutCloudLicense：登出云许可
 * 
 * 云许可使用流程提示：
 *   登录云许可 --> 查询云许可 --> 激活云许可 --> 归还云许可 --> 登出云许可
 * 
 * 离线许可使用流程提示：
 *   激活离线许可 --> 归还离线许可
 * 
 * 示例位置：
 *   License组件（SMMOBILEDEMO/src/components/License/License.tsx）
 * 
 */

import { SData } from "imobile_for_reactnative"
import Toast from "./Toast"

interface licenseResultType extends SData.QueryCloudLicenseResult{
  isStaff?: boolean,
}

/** 当前许可类型 null 表示当前没有许可 */
let licenseCurrentType: string | null = null

/**
 * 获取当前许可的类型
 * @returns 三种返回值 , null 表示当前没有有效许可， cloud 表示当前许可为云许可， offline 表示当前许可为离线许可
 */
function getLicenseType (): string | null {
  return licenseCurrentType
}

/**
 * 激活离线许可
 * @param {string} code 离线许可激活码（形式： xxxxx-xxxxx-xxxxx-xxxxx-xxxxx）
 * @returns {Promise<boolean>} 返回一个布尔类型，true表示激活成功，false表示激活失败
 */
async function activateLicense(code: string): Promise<boolean>{
  try {
    if(licenseCurrentType){
      // 有许可，不激活
      Toast.show('当前已有许可被激活')
      return false
    }
    const result = await SData.activateLicense(code)
    if(result) {
      Toast.show('激活成功')
      licenseCurrentType = 'offline'
    } else {
      Toast.show('激活失败')
      licenseCurrentType = null
    }
    return result
  } catch (error) {
    Toast.show('激活失败')
    licenseCurrentType = null
    return false
  }
}

/**
 * 重新加载已激活的离线许可 （在激活离线许可后，退出app，再次进入app需要调这个方法来重新加载已激活的离线许可）
 * @returns
 */
async function reloadLocalLicense(): Promise<void>{
  try {
    const result = await SData.reloadLocalLicense()
    if(result) {
      licenseCurrentType = 'offline'
    } else {
      licenseCurrentType = null
    }
  } catch (error) {
    console.warn("已有许可激活失败")
  }
}

/**
 * 登录云许可 （登录云许可 --> 查询云许可 --> 激活云许可）
 * @param {string} user 云许可账号
 * @param {string} pwd 云许可账号对应的密码
 * @returns {Promise<boolean>} 返回一个布尔类型，true表示激活成功，false表示激活失败
 */
async function loginCloudLicense(user: string, pwd: string): Promise<boolean> {
  try {
    if(licenseCurrentType){
      // 有许可，不激活
      Toast.show('当前已有许可被激活')
      return false
    }

    let flag = false
    // 设置云许可站点
    await SData.setCloudLicenseSite('DEFAULT')
    await logoutCloudLicense()

    // 登录云许可
    let loginResult = await SData.loginCloudLicense(user, pwd)

    let timeout = (sec: number) => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve('timeout')
        }, 1000 * sec)
      })
    }
    let res = await Promise.race([loginResult, timeout(20)])

    let result
    if (res === 'timeout') {
      Toast.show("登录超时，请稍后再试")
      licenseCurrentType = null
      return false
    } else {
      result = res
    }
    if(!result) {
      Toast.show("登录失败")
      licenseCurrentType = null
      await logoutCloudLicense()
    } else {
     // 登录成功，激活许可

     // 登录成功之后需要先查询许可，才能成功激活有效的许可
     await queryCloudLicense()
     // 激活云许可
     flag = await applyCloudTrialLicense()
    }
    return flag
  } catch (error) {
     Toast.show("登录失败 error")
     licenseCurrentType = null
     await logoutCloudLicense()
     return false
  }
}

/**
 * 查询许可（登录云许可 --> 查询云许可 --> 激活云许可）
 * @returns 返回查询到的许可信息
 */
async function queryCloudLicense(): Promise<licenseResultType | null | undefined> {
  try {
    let licenseResult: licenseResultType | null | undefined
    try {
    // 查询许可
      licenseResult = await SData.queryCloudLicense()
    } catch (error) {
      licenseResult = {
        licenses: [],
        hasTrial: false,
      }
    }
    if(!licenseResult){
      Toast.show("查询许可失败")
      licenseCurrentType = null
      await logoutCloudLicense()
      return null
    }
    licenseResult.isStaff = false
    if(licenseResult.licenses.length === 0) {
      // 查询是否包含试用许可和员工许可
      const queryResult = await SData.queryCloudTrialLicense()
      licenseResult.isStaff = queryResult.staff
    }
    return licenseResult
  } catch (error) {
    console.warn('查询许可失败')
    return null
  }
}

/**
 * 激活云许可（登录云许可 --> 查询云许可 --> 激活云许可）
 * @returns 返回一个布尔值，可用于判断云许可是否激活成功
 */
async function applyCloudTrialLicense(): Promise<boolean> {
  try {
    let flag = false
    // 激活云许可
    let activeResult = await SData.applyCloudTrialLicense()
    if(!activeResult) {
      Toast.show("激活失败")
      licenseCurrentType = null
    } else {
      Toast.show("激活成功")
      licenseCurrentType = 'cloud'
      flag = true
    }
    return flag
  } catch (error) {
    Toast.show("激活失败")
    licenseCurrentType = null
    return false
  }
}


/** 
 * 归还许可
 * @returns
 */
 async function recycleLicense(): Promise<void>{
  try {
    if(licenseCurrentType === 'offline'){
      // 归还离线许可
      let serialNumber = await SData.initSerialNumber('')
      if (serialNumber !== '') {
        // await SData.reloadLocalLicense()
        let result = await SData.recycleLicense()
        if(result) {
          licenseCurrentType = null
          Toast.show("归还离线许可成功")
        } else {
          Toast.show("归还离线许可失败")
        }
      } else {
        // 清除本地许可文件
        let result = await SData.clearLocalLicense()
        if(result) {
          licenseCurrentType = null
          Toast.show("归还离线许可成功")
        } else {
          Toast.show("归还离线许可失败")
         
        }
      }
      
    } else if(licenseCurrentType === 'cloud') {
      // 归还云许可
      let days = await SData.recycleCloudLicense('', '')
      if(days < 0) {
        Toast.show("归还云许可失败")
      } else {
        licenseCurrentType = null
        await logoutCloudLicense()
        Toast.show("归还云许可成功")
      }
    } else {
      Toast.show("当前没有有效许可归还")
    }
  } catch (error) {
    Toast.show("归还失败")
  }
}

/**
 * 登出云许可
 * @returns
 */
async function logoutCloudLicense(): Promise<void> {
  try {
    SData.logoutCloudLicense()
  } catch (error) {
    console.warn("登出失败")
  }
}

export default{
  getLicenseType,
  activateLicense,
  reloadLocalLicense,
  loginCloudLicense,
  queryCloudLicense,
  applyCloudTrialLicense,
  recycleLicense,
  logoutCloudLicense,
}
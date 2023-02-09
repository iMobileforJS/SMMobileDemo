import { SException } from "imobile_for_reactnative"


/** debug模式下输出log */
export function log(message?: any, ...optionalParams: any[]): void {
  if(__DEV__) {
    console.log(message, optionalParams)
  }
}

export function warn(message?: any, ...optionalParams: any[]): void {
  if(__DEV__) {
    console.warn(message, optionalParams)
  }
}

export function error(message?: any, ...optionalParams: any[]): void {
  if(__DEV__) {
    console.error(message, optionalParams)
  }
}

export function addExceptionHandler() {
  SException.addNativeExceptionListener(e => {
    error(e)
  })
}

addExceptionHandler()
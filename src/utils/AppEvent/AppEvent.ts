import { Event } from './type'
import * as AppLog from '../AppLog'

type Listener<key extends keyof Event> = (param:Event[key]) => void
type ListenerArr<key extends keyof Event> = Array< Listener<key> >

const events = new Map<keyof Event, ListenerArr<keyof Event>>()

/** 添加事件监听 */
function addListener<key extends keyof Event>(
  event: key,
  listener: Listener<key>
): void {
  let listeners = events.get(event)
  if(listeners === undefined) {
    listeners = []
  }
  listeners.push(listener as Listener<keyof Event>)
  events.set(event, listeners)
}

/** 移除事件监听 */
function removeListener<key extends keyof Event>(
  event: key,
  listener?: Listener<key>
): void {
  const listeners = events.get(event)
  if(listeners !== undefined) {
    if(listener !== undefined) {
      const i = (listeners as ListenerArr<key>).indexOf(listener)
      if(i > -1) {
        listeners.splice(i, 1)
      }
    } else {
      events.set(event, [])
    }
  }
}

/** 发送事件 */
function emitEvent<key extends keyof Event>(event: key, param: Event[key]):void
function emitEvent<key extends keyof Event>(...args: undefined extends Event[key] ? [key] : [key, Event[key]]): void
function emitEvent<key extends keyof Event>(...args: undefined extends Event[key] ? [key] : [key, Event[key]]): void {
  const event = args[0]
  const param = args[1]
  const listeners : ListenerArr<key> | undefined = events.get(event)
  if(listeners && listeners.length > 0) {
    listeners.map(listener => {
      listener(param as Event[key])
    })
  } else {
    AppLog.log('没有添加监听！', event)
  }
}


export default {
  addListener,
  removeListener,
  emitEvent,
}

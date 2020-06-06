import { QueryOption, UpdateOption } from '../query'
import { EJSON } from 'bson'
import { isObject, isArray, isInternalObject } from './type'
import { ServerDate } from '../serverDate'
import { RegExp } from '../regexp'
import * as Geo from '../geo'
import { QueryCommand } from '../commands/query'
import { LogicCommand } from '../commands/logic'
import { UpdateCommand } from '../commands/update'
import {
  SYMBOL_GEO_POINT,
  SYMBOL_GEO_LINE_STRING,
  SYMBOL_GEO_POLYGON,
  SYMBOL_GEO_MULTI_POINT,
  SYMBOL_GEO_MULTI_LINE_STRING,
  SYMBOL_GEO_MULTI_POLYGON,
  SYMBOL_UPDATE_COMMAND,
  SYMBOL_QUERY_COMMAND,
  SYMBOL_LOGIC_COMMAND,
  SYMBOL_SERVER_DATE,
  SYMBOL_REGEXP
} from '../helper/symbol'

export const sleep = (ms: number = 0) => new Promise(r => setTimeout(r, ms))

const counters: Record<string, number> = {}

export const autoCount = (domain: string = 'any'): number => {
  if (!counters[domain]) {
    counters[domain] = 0
  }
  return counters[domain]++
}

export const getReqOpts = (apiOptions: QueryOption | UpdateOption): any => {
  // 影响底层request的暂时只有timeout
  if (apiOptions.timeout !== undefined) {
    return {
      timeout: apiOptions.timeout
    }
  }

  return {}
}

export const stringifyByEJSON = params => {
  return EJSON.stringify(params, { relaxed: false })
}

export const parseByEJSON = params => {
  return EJSON.parse(params)
}

export class TcbError extends Error {
  readonly code: string
  readonly message: string
  constructor(error: IErrorInfo) {
    super(error.message)
    this.code = error.code
    this.message = error.message
  }
}

export const E = (errObj: IErrorInfo) => {
  return new TcbError(errObj)
}

const GRAY_ENV_KEY = 'TCB_SDK_GRAY_0'
const needTransformFunc = ['update', 'set', 'create', 'add']

export const preProcess = () => {
  return function(_target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    let newFunc = descriptor.value

    descriptor.value = async function() {
      // 默认走旧实例方法
      const oldInstance = this._oldInstance

      const oldFunc = oldInstance[propertyKey]
      // 优先检查用户是否有主动设置使用新特性
      if (this._db && this._db.config) {
        const { _useFeature } = this._db.config
        if (_useFeature === true) {
          // 主动设置走新逻辑
          return newFunc.apply(this, arguments)
        }
      }

      // 其次走环境变量控制
      try {
        if (process.env.TCB_CONTEXT_CNFG) {
          // 检查约定环境变量字段是否存在
          const grayEnvKey = JSON.parse(process.env.TCB_CONTEXT_CNFG)
          if (grayEnvKey[GRAY_ENV_KEY] === true) {
            return newFunc.apply(this, arguments)
          }
        }
      } catch (e) {
        console.log('parse context error...')
      }

      // 针对db update, set, create 方法，需先将参数转换
      if (needTransformFunc.indexOf(propertyKey) >= 0) {
        return oldFunc.call(
          oldInstance,
          transformDbObjFromNewToOld(arguments[0], oldInstance._db, [arguments[0]])
        )
      }
      return oldFunc.apply(oldInstance, arguments)
    }
  }
}

export function processReturn(throwOnCode: boolean, res: any) {
  if (throwOnCode === false) {
    // 不抛报错，正常return，兼容旧逻辑
    return res
  }

  throw E({ ...res })
}

// 将新sdk db生成 的query, data 转换为旧sdk db构造(兼容用)
export function transformDbObjFromNewToOld(val: any, oldDb: any, visited: object[]): any {
  // 递归遍历数组or对象的key-value
  // 1. 检查value是否是特殊类型 RegExp(类形式)，Geo，ServerDate
  // 2. 检查value是否为command 类型
  // 3. 替换value为 旧db 属性构成(oldDb.Geo, oldDb.RegExp, oldDb.command)

  if (isInternalObject(val)) {
    // UPDATE_COMMAND, QUERY_COMMAND, LOGIC_COMMAND, SERVER_DATE，REGEXP， GEO_POINT,SYMBOL_GEO_LINE_STRING，SYMBOL_GEO_POLYGON，SYMBOL_GEO_MULTI_POINT，SYMBOL_GEO_MULTI_LINE_STRING，SYMBOL_GEO_MULTI_POLYGON
    switch (val._internalType) {
      case SYMBOL_GEO_POINT: {
        const { longitude, latitude } = val as Geo.Point
        return new oldDb.Geo.Point(longitude, latitude)
      }
      case SYMBOL_GEO_MULTI_POINT: {
        const { points } = val as Geo.MultiPoint

        const transformPoints = points.map(item =>
          transformDbObjFromNewToOld(item, oldDb, [...visited, item])
        )
        return new oldDb.Geo.MultiPoint(transformPoints)
      }

      case SYMBOL_GEO_LINE_STRING: {
        const { points } = val as Geo.LineString
        const transformPoints = points.map(item =>
          transformDbObjFromNewToOld(item, oldDb, [...visited, item])
        )
        return new oldDb.Geo.LineString(transformPoints)
      }
      case SYMBOL_GEO_MULTI_LINE_STRING: {
        const { lines } = val as Geo.MultiLineString
        const transformLines = lines.map(item =>
          transformDbObjFromNewToOld(item, oldDb, [...visited, item])
        )

        return new oldDb.Geo.MultiLineString(transformLines)
      }
      case SYMBOL_GEO_POLYGON: {
        const { lines } = val as Geo.Polygon
        const transformLines = lines.map(item =>
          transformDbObjFromNewToOld(item, oldDb, [...visited, item])
        )
        return new oldDb.Geo.Polygon(transformLines)
      }

      case SYMBOL_GEO_MULTI_POLYGON: {
        const { polygons } = val as Geo.MultiPolygon
        const transformPolygons = polygons.map(item =>
          transformDbObjFromNewToOld(item, oldDb, [...visited, item])
        )
        return new oldDb.Geo.MultiPolygon(transformPolygons)
      }

      case SYMBOL_SERVER_DATE: {
        const { offset } = val as ServerDate
        return new oldDb.serverDate({ offset })
      }
      case SYMBOL_REGEXP: {
        const {
          $regularExpression: { options, pattern }
        } = val as RegExp
        return new oldDb.RegExp({ regexp: pattern, options })
      }

      case SYMBOL_UPDATE_COMMAND: {
        const { operator, operands } = val as UpdateCommand
        // 递归转换
        let transformOperands
        if (isArray(operands)) {
          transformOperands = operands.map(item =>
            transformDbObjFromNewToOld(item, oldDb, [...visited, item])
          )
        } else {
          transformOperands = transformDbObjFromNewToOld(operands, oldDb, [...visited, operands])
        }
        return new oldDb.updateCommand(operator, transformOperands)
      }

      case SYMBOL_QUERY_COMMAND: {
        const { operator, operands } = val as QueryCommand
        // 递归转换

        let transformOperands
        if (isArray(operands)) {
          transformOperands = operands.map(item =>
            transformDbObjFromNewToOld(item, oldDb, [...visited, item])
          )
        } else {
          transformOperands = transformDbObjFromNewToOld(operands, oldDb, [...visited, operands])
        }

        return new oldDb.queryCommand(operator, transformOperands)
      }

      case SYMBOL_LOGIC_COMMAND: {
        const { operator, operands } = val as LogicCommand
        // 递归转换
        let transformOperands
        if (isArray(operands)) {
          transformOperands = operands.map(item =>
            transformDbObjFromNewToOld(item, oldDb, [...visited, item])
          )
        } else {
          transformOperands = transformDbObjFromNewToOld(operands, oldDb, [...visited, operands])
        }

        return new oldDb.logicCommand(operator, transformOperands)
      }
    }
  } else if (isArray(val)) {
    return val.map(item => {
      if (visited.indexOf(item) > -1) {
        throw new Error('Cannot convert circular structure to JSON')
      }

      return transformDbObjFromNewToOld(item, oldDb, [...visited, item])
    })
  } else if (isObject(val)) {
    const rawRet: any = { ...val }
    const finalRet: any = {}
    for (const key in rawRet) {
      if (visited.indexOf(rawRet[key]) > -1) {
        throw new Error('Cannot convert circular structure to JSON')
      }

      // 过滤掉undefined
      finalRet[key] = transformDbObjFromNewToOld(rawRet[key], oldDb, [...visited, rawRet[key]])
    }
    return finalRet
  } else {
    return val
  }
}

interface IErrorInfo {
  code?: string
  message?: string
}

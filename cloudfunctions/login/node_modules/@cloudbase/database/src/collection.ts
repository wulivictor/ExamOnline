import { Db } from './index'
import { DocumentReference } from './document'
import { Query, QueryOption, UpdateOption } from './query'
import Aggregation from './aggregate'
import { serialize } from './serializer/datatype'
import { getReqOpts, stringifyByEJSON, preProcess } from './utils/utils'
import { Validate } from './validate'
import { isArray } from './utils/type'

// import { EJSON } from 'bson'

/**
 *
 * 集合模块，继承 Query 模块
 *
 * @author haroldhu
 */
export class CollectionReference extends Query {
  private _transactionId: string
  /**
   * 初始化
   *
   * @internal
   *
   * @param db    - 数据库的引用
   * @param coll  - 集合名称
   */
  /* eslint-disable no-useless-constructor */
  constructor(
    db: Db,
    coll: string,
    apiOptions?: QueryOption | UpdateOption,
    transactionId?: string
  ) {
    super(db, coll, '', apiOptions, db._oldDbInstance.collection(coll))
    if (transactionId) {
      this._transactionId = transactionId
    }
  }

  /**
   * 读取集合名字
   */
  get name() {
    return this._coll
  }

  /**
   * 获取文档的引用
   *
   * @param docID - 文档ID
   */
  doc(docID: string | number): DocumentReference {
    if (typeof docID !== 'string' && typeof docID !== 'number') {
      throw new Error('docId必须为字符串或数字')
    }
    return new DocumentReference(
      this._db,
      this._coll,
      this._apiOptions,
      docID,
      this._transactionId,
      this._db._oldDbInstance.collection(this._coll).doc(docID)
    )
  }

  /**
   * 添加一篇文档
   *
   * @param data  - 数据
   * @param opts  - 可选配置项
   */
  @preProcess()
  async add(
    data: any
  ): Promise<{
    ids?: string[]
    id?: string
    inserted?: number // 事务调用返回
    ok?: number // 事务调用返回
    requestId: string
  }> {
    // 判断data是否为数组, 兼容处理
    let transformData = data
    if (!isArray(data)) {
      transformData = [data]
    }

    transformData = transformData.map(item => {
      return stringifyByEJSON(serialize(item))
    })
    let params = {
      collectionName: this._coll,
      data: transformData
    }

    const res = await this._request.send(
      'database.insertDocument',
      params,
      getReqOpts(this._apiOptions)
    )

    if (res.code) {
      return res
    }
    // if (res.code) {
    //   throw E({ ...res })
    // } else {
    // 判断data是否为数组, 兼容处理
    if (!isArray(data)) {
      // 兼容原事务 插入文档接口
      if (this._transactionId) {
        return {
          inserted: 1,
          ok: 1,
          id: res.data.insertedIds[0],
          requestId: res.requestId
        }
      }
      return {
        id: res.data.insertedIds[0],
        requestId: res.requestId
      }
    }

    // 批量插入统一返回不区分是否在事务中b)
    return {
      ids: res.data.insertedIds,
      requestId: res.requestId
    }
    // }
  }

  aggregate() {
    return new Aggregation(this._db, this._coll)
  }

  /**
   * 设置请求操作项
   *
   * @param {(QueryOption | UpdateOption)} apiOptions
   * @memberof Query
   */
  public options(apiOptions: QueryOption | UpdateOption) {
    // 校验字段是否合规
    Validate.isValidOptions(apiOptions)
    return new CollectionReference(this._db, this._coll, apiOptions, this._transactionId)
  }
}

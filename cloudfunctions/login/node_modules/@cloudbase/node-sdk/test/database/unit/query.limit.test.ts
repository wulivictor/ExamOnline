import * as assert from 'power-assert'
import tcb from '../../../src/index'
import * as config from '../../config.local'
import * as bPromise from 'bluebird'
import { checkIsGray } from '../../../src/utils/utils'

const app = tcb.init(config)
const db = app.database()

beforeAll(async () => {
    if (checkIsGray() || config._useFeature) {
        // 删除 1001条文档
        const collName = 'coll-1'
        const collection = db.collection(collName)
        const delRes = await collection
            .where({
                luke: 'luke-limit-test'
            })
            .remove()
        assert(delRes.deleted >= 0)
        // assert(delRes.)
        console.log('delRes*******', delRes)
        // // 创建 1001条文档
        let addDocs = []
        let i = 0
        while (i++ < 1000) {
            addDocs.push({ luke: 'luke-limit-test' })
        }
        const addRes = await collection.add(addDocs)
        console.log('addRes:', addRes.ids.length)
        // assert(addRes.ids.length === 1001)
    }
})

describe('test/unit/query.limit.test.ts', () => {
    // const defaultDbName = 'default'

    // it('use default db', () => {
    //   assert(db.config.dbname === defaultDbName)
    // })

    // 等于 1000
    it('query with limit 1000', async () => {
        const collName = 'coll-1'
        const collection = db.collection(collName)
        const queryRes = await collection
            .where({})
            .limit(1000)
            .get()
        if (queryRes.data) {
            console.log('limit 1000', queryRes.data.length)
        } else {
            console.log(queryRes)
        }
        assert(queryRes.data.length === 1000)
    })

    // 大于1000
    it('query with limit > 1000', async () => {
        const collName = 'coll-1'
        const collection = db.collection(collName)
        const queryRes = await collection
            .where({})
            .limit(1001)
            .get()
        if (queryRes.data) {
            console.log('limit > 1000', queryRes.data.length)
        } else {
            console.log(queryRes)
        }
        assert(queryRes.data.length === 1000)
    })

    // 小于1000
    it('query with limit < 1000', async () => {
        const collName = 'coll-1'
        const collection = db.collection(collName)
        const queryRes = await collection
            .where({})
            .limit(101)
            .get()
        if (queryRes.data) {
            console.log('limit < 1000', queryRes.data.length)
        } else {
            console.log(queryRes)
        }
        assert(queryRes.data.length === 101)
    })

    // 不填 默认100
    it('query with limit default 100', async () => {
        const collName = 'coll-1'
        const collection = db.collection(collName)
        const queryRes = await collection.where({}).get()
        if (queryRes.data) {
            console.log('limit default 100', queryRes.data.length)
        } else {
            console.log(queryRes)
        }

        assert(queryRes.data.length === 100)
    })

    // it('API - getCollections', async () => {
    //     const data = await db.getCollections()
    //     assert(Array.isArray(data.collections))
    // })
})

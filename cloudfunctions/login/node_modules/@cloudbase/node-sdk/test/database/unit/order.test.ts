import * as assert from 'power-assert'
import * as Mock from '../unit/mock'
import tcb from '../../../src/index'
import * as config from '../../config.local'
import * as common from '../../common/index'

describe('正则表达式查询', async () => {
    console.log(config)

    const app = tcb.init(config)
    const db = app.database()

    const collName = 'coll-1'
    const collection = db.collection(collName)
    // const nameList = ["f", "b", "e", "d", "a", "c"];

    it('Document - createCollection()', async () => {
        await common.safeCollection(db, collName)
    })
    it('Document - OrderBy', async () => {
        // Create

        const deleteRes1 = await db
            .collection(collName)
            .where({
                category: /^类别/
            })
            .remove()
        console.log('deleteRes1:', deleteRes1)

        for (var i = 0; i < 1; i++) {
            const res = await collection.add({
                category: '类别B',
                value: Math.random()
            })

            // assert(res.ids[0])
            assert(res.id)
            assert(res.requestId)
        }

        for (var i = 0; i < 1; i++) {
            const res = await collection.add({
                category: '类别C',
                value: Math.random()
            })
            // assert(res.ids[0])
            assert(res.id)
            assert(res.requestId)
        }

        await collection.add({
            category: '类别A',
            value: Math.random()
        })

        // Read
        let result = await collection
            .where({
                category: /^类别/i
            })
            .orderBy('category', 'asc')
            .get()
        console.log('result.data:', result.data)
        // assert(result.data.length >= 11)
        assert(result.data[0].category === '类别A')
        assert(result.data[result.data.length - 1].category === '类别C')

        // Delete
        const deleteRes = await collection
            .where({
                category: db.RegExp({
                    regexp: '^类别'
                    // options: 'i'
                })
            })
            .remove()
        console.log(deleteRes)
        assert(deleteRes.deleted >= 1)
    }, 30000)
})

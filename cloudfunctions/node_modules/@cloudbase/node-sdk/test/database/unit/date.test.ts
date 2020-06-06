import * as assert from 'power-assert'
import * as Mock from './mock'
import tcb from '../../../src/index'
import * as Config from '../../config.local'
import * as common from '../../common/index'
import * as util from 'util'
// import { process } from "ts-jest/dist/preprocessor";
// import { __exportStar } from "tslib";

describe('Date类型', async () => {
    const config = {
        ...Config,
        env: Mock.env,
        mpAppId: Mock.appId,
        sessionToken: undefined
    }

    const app = tcb.init(config)
    const db = app.database()

    const collName = 'coll-1'
    const collection = db.collection(collName)
    // const nameList = ["f", "b", "e", "d", "a", "c"];

    it('Document - createCollection()', async () => {
        await common.safeCollection(db, collName)
    })

    const date = new Date()
    const offset = 60 * 1000
    // const timestamp = Math.floor(+new Date() / 1000)
    const initialData = {
        name: 'test',
        date,
        serverDate1: new db.serverDate(),
        serverDate2: db.serverDate({ offset }),
        emptyArray: [],
        emptyObject: {},
        // timestamp: {
        //     $timestamp: timestamp
        // }
        foo: {
            bar: db.serverDate({ offset })
        }
    }

    it('Document - CRUD', async () => {
        // Create
        const res = await collection.add(initialData)
        console.log(res)
        // const id = res.ids[0]
        const id = res.id
        assert(id)
        assert(res.requestId)

        // // Read
        // const { id } = res
        let result = await collection
            .where({
                _id: id
            })
            .get()
        console.log(result.data[0])
        assert.strictEqual(result.data[0].date.getTime(), date.getTime())
        assert(util.isDate(result.data[0].foo.bar))
        assert.strictEqual(assert.strictEqual(result.data[0].serverDate1.getDate(), date.getDate()))
        assert.strictEqual(
            result.data[0].serverDate1.getTime() + offset,
            result.data[0].serverDate2.getTime()
        )
        // assert.strictEqual(result.data[0].timestamp.getTime(), timestamp * 1000)
        assert.deepStrictEqual(result.data[0].emptyArray, [])
        assert.deepStrictEqual(result.data[0].emptyObject, {})

        result = await collection
            .where({
                date: db.command.eq(date)
            })
            .get()
        console.log(result)
        assert.strictEqual(result.data[0].date.getTime(), date.getTime())

        result = await collection
            .where({
                date: db.command.lte(date)
            })
            .get()
        console.log(result)
        assert(result.data.length > 0)

        result = await collection
            .where({
                date: db.command.lte(date).and(db.command.gte(date))
            })
            .get()
        console.log(result)
        assert(result.data.length > 0)

        // Update
        const newDate = new Date()
        const newServerDate = new db.serverDate({ offset: 1000 * 60 * 60 }) // offset一小时
        result = await collection
            .where({
                date: db.command.lte(date).and(db.command.gte(date))
            })
            .update({
                date: newDate,
                serverDate2: newServerDate
            })
        console.log(result)
        assert.strictEqual(result.updated, 1)
        result = await collection
            .where({
                _id: id
            })
            .get()
        console.log(result)
        assert.strictEqual(result.data[0].date.getTime(), newDate.getTime())
        assert(
            result.data[0].serverDate2.getTime() - result.data[0].serverDate1.getTime() >
                1000 * 60 * 60
        )

        // Delete
        const deleteRes = await collection.doc(id).remove()
        assert.strictEqual(deleteRes.deleted, 1)
    })
})

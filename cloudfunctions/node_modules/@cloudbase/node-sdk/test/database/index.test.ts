import * as assert from 'power-assert'
import * as Mock from './unit/mock'
import tcb from '../../src/index'
import * as config from '../config.local'
import * as common from '../common/index'
import { ERROR } from '../../src/const/code'
import { checkIsGray } from '../../src/utils/utils'

describe('test/index.test.ts', async () => {
    const app = tcb.init({
        ...config,
        // env: Mock.env,
        // mpAppId: Mock.appId,
        sessionToken: undefined,
        throwOnCode: false
    })

    let db = null

    try {
        db = app.database('env')
    } catch (err) {
        assert(err.code === ERROR.INVALID_PARAM.code)
    }

    const currEnv = tcb.SYMBOL_CURRENT_ENV
    // 线上跑，本地不用跑

    // if (currEnv) {
    //     if (checkIsGray()) {
    //         db = app.database({ env: currEnv })
    //     } else {
    //         db = app.database()
    //     }
    // } else {
    //     db = app.database()
    // }

    db = app.database()

    const _ = db.command

    const collName = 'coll-1'
    const collection = db.collection(collName)
    // const nameList = ['f', 'b', 'e', 'd', 'a', 'c']

    // it('Document - createCollection()', async () => {
    //     await common.safeCreateCollection(db, collName)
    // })

    const initialData = {
        name: 'aaa',
        array: [1, 2, 3, [4, 5, 6], { a: 1, b: { c: 'fjasklfljkas', d: false } }],
        data: {
            a: 'a',
            b: 'b',
            c: 'c'
        },
        null: null,
        date: new Date(),
        regex: new db.RegExp({
            regexp: '.*',
            options: 'i'
        }),
        deepObject: {
            'l-02-01': {
                'l-03-01': {
                    'l-04-01': {
                        level: 1,
                        name: 'l-01',
                        flag: '0'
                    }
                }
            }
        }
    }

    if (checkIsGray() || config._useFeature) {
        it('验证throwOnCode', async () => {
            const res = await collection.add({ $_key: 1 })
            console.log(res)
        })
    }

    if (checkIsGray() || config._useFeature) {
        it('mock 插入多条', async () => {
            // 构建4W条数据
            let mockData = [],
                i = 0
            while (i++ < 10) {
                mockData.push({ string: 'a', int: -1 })
            }

            const addRes = await collection.add(mockData)
            assert(addRes.ids.length === 10)
            // console.log('addRes:', addRes)
        })
    }

    it('清楚mock数据', async () => {
        const deleteRes = await collection.where({ int: -1 }).remove()
        console.log('deleteRes:', deleteRes)
    })

    it('验证 无 query count', async () => {
        const countRes = await collection.count()
        assert(countRes.total > 0)
        console.log('countRes:', countRes)
    })

    it('验证 无 query update', async () => {
        const updateRes = await collection.update({ a: 1 })
        if (config._useFeature) {
            assert(updateRes.code === 'INVALID_PARAM')
        } else {
            assert(updateRes.updated >= 0)
        }
    })

    it('document query custom timeout', async () => {
        const res = await collection
            .where({})
            // .options({ timeout: 3000 })
            .limit(1)
            .get()
        console.log(res)
    })

    it('Document - CRUD', async () => {
        // Create
        const initialData = {
            // $key: '1',
            'key.': '1'
        }
        const res = await collection.add(initialData)
        console.log('res:', res)
        console.log(res)
        // assert(res.ids.length > 0)
        assert(res.id)
        assert(res.requestId)

        // Read
        // const { ids } = res
        // const id = ids[0]
        const id = res.id
        // let result = await collection
        //   .where({
        //     _id: id
        //   })
        //   .get()
        // console.log(result)
        // assert.deepStrictEqual(result.data[0].name, initialData.name)
        // assert.deepStrictEqual(result.data[0].array, initialData.array)
        // assert.deepStrictEqual(result.data[0].deepObject, initialData.deepObject)

        // // 搜索某个字段为 null 时，应该复合下面条件的都应该返回：
        // // 1. 这个字段严格等于 null
        // // 2. 这个字段不存在
        // // docs: https://docs.mongodb.com/manual/tutorial/query-for-null-fields/
        // result = await collection
        //   .where({
        //     fakeFields: _.or(_.eq(null))
        //   })
        //   .get()
        // assert(result.data.length > 0)

        // const doc = await collection.doc(id).get()
        // assert.deepStrictEqual(doc.data[0].name, initialData.name)
        // assert.deepStrictEqual(doc.data[0].array, initialData.array)
        // assert.deepStrictEqual(doc.data[0].deepObject, initialData.deepObject)

        // // // Update(TODO)
        // result = await collection
        //   .where({
        //     _id: id
        //   })
        //   .update({
        //     name: 'bbb',
        //     array: [{ a: 1, b: 2, c: 3 }]
        //   })
        // console.log(result)
        // assert(result.updated > 0)

        let result = await collection
            .where({
                _id: id
            })
            .update({
                data: { a: null, b: null, c: null }
            })
        console.log(result)
        assert(result.updated > 0)

        result = await collection.where({ _id: id }).get()
        console.log(result.data)
        assert(result.data[0])
        assert.deepStrictEqual(result.data[0].data, { a: null, b: null, c: null })

        // 数组变为对象，mongo会报错
        // result = await collection
        //   .where({
        //     _id: id
        //   })
        //   .update({
        //     array: { foo: 'bar' }
        //   })
        // console.log(result)
        // assert.strictEqual(result.code, 'DATABASE_REQUEST_FAILED')

        // result = await collection
        //   .where({
        //     _id: id
        //   })
        //   .get()
        // console.log(result)
        // assert.deepStrictEqual(result.data[0].array, [{ a: 1, b: 2, c: 3 }])

        // Delete
        const deleteRes = await collection.doc(id).remove()
        assert.strictEqual(deleteRes.deleted, 1)
    })

    it('Document - query', async () => {
        assert((await collection.add({ a: 1, b: 100 })).id)
        assert((await collection.add({ a: 10, b: 1 })).id)
        const query = _.or({ b: _.and(_.gte(1), _.lte(10)) }, { b: _.and(_.gt(99), _.lte(101)) })
        const result = await collection.where(query).get()
        assert(result.data.length >= 2)

        // Delete
        const deleteRes = await collection.where(query).remove()
        assert(deleteRes.deleted, 2)
    })

    it('复合and', async () => {
        const result = await collection
            .where({
                date: _.gt(20190401).and(_.lte(20190430)),
                hour: _.gt(8).and(_.lte(12))
            })
            .get()

        console.log(result)
        assert(!result.code)
    })

    it('验证自定义超时', async () => {
        try {
            const result = await collection
                .where({
                    date: _.gt(20190401).and(_.lte(20190430)),
                    hour: _.gt(8).and(_.lte(12))
                })
                // .options({ timeout: 10 })
                .get()
            assert(!result)
        } catch (err) {
            // assert(err.code === 'ESOCKETTIMEDOUT')
        }
        // console.log(result)
        // assert(!result.code)
    })

    it('Document - doc().update()', async () => {
        // console.log(
        //   await collection
        //     .where({
        //       a: '2'
        //     })
        //     .remove()
        // )
        // return
        // console.log(await db.createCollection('ccc'))
        // return
        // var a = { a: { b: _.and(_.gt(1), _.lt(32)) } }
        // var a = { b: _.lte(2) }
        // var a = { b: _.and(_.gt(2), _.lte(25)) }
        // var a = _.or([
        //   { b: _.and(_.gt(1), _.lte(25)) },
        //   { b: _.and(_.gt(20), _.lte(25)) }
        // ])
        // console.log(await collection.where(a).get())
        // console.log(
        //   await collection.add({
        //     _id: '12234',
        //     a: { b: { d: 1 } }
        //   })
        // )
        // return
        // console.log(
        //   await collection
        //     .where({
        //       a: { b: { d: 1 } }
        //     })
        //     .skip(0)
        //     .get()
        // )
        // return
        // console.log(
        //   await collection
        //     .where({
        //       a: '10'
        //     })
        //     .update({
        //       c: db.serverDate({ offset: 100 })
        //     })
        // )
        // return
        // const clean = () => {
        //   it('Document - doc().remove() - clean all documents', async () => {
        //     const res = await collection.get()
        //     // console.log(res);
        //     const promiseList = res.data.map(document => {
        //       return collection.doc(document._id).remove()
        //     })
        //     await Promise.all(promiseList)
        //     const res1 = await collection.get()
        //     // console.log(res1);
        //     assert(Array.isArray(res1.data))
        //     assert(res1.data.length === 0)
        //   })
        // }
        // it('DB - use default db', async () => {
        //   // assert(db.config.dbname === defaultDbName);
        // })
        // it('Collection - the collection name', () => {
        //   assert(collection.name === collName)
        // })
        // it('Collection - query count', async () => {
        //   const res = await collection
        //     .where({
        //       like_key: '1111'
        //     })
        //     .count()
        //   console.log(res)
        // })
        // clean()
        // it('Collection - should be empty', async () => {
        //   const res = await collection.get()
        //   // console.log(JSON.stringify(res));
        //   assert(Array.isArray(res.data))
        //   assert(res.data.length === 0)
        // })
        // it('Document - doc().set()', async () => {
        //   const res = await collection.doc().set({
        //     name: 'mz',
        //     url:
        //       'https://b86.photo.store.qq.com/psb?/V11mueXx0BWCDF/GKMTZTUHLU6yqgDwcVZxkv1jtYpGj1C5qnocertN90U!/a/dFYAAAAAAAAA'
        //   })
        //   assert(!!res.upsertedId)
        // })
        // it('Collection - add()', async () => {
        //   const point = new db.Geo.Point(21, -23)
        //   const data = await collection.add({
        //     name: 'hm',
        //     time: new Date(),
        //     point: point
        //   })
        //   assert(!!data.id)
        // })
        // it('Document - doc().update()', async () => {
        //   const res = await collection.where({ name: _.eq('mz') }).get()
        //   const docId = res.data[0].id
        //   const result = await collection.doc(docId).update({
        //     name: 'hm-mz'
        //   })
        //   assert(result.updated === 1)
        // })
        // it('Collection - where()', async () => {
        //   const res = await collection.where({ name: _.eq('hm-mz') }).get()
        //   assert(Array.isArray(res.data))
        //   assert(res.data.length === 1)
        // })
        // it('Collection - add many documents', async () => {
        //   const promiseList = nameList.map(name => {
        //     return collection.add({
        //       name: name
        //     })
        //   })
        //   await Promise.all(promiseList)
        //   const res = await collection.get()
        //   // console.log(res);
        //   assert(Array.isArray(res.data))
        //   assert(res.data.length >= nameList.length)
        // })
        // it('Collection - orderBy()', async () => {
        //   const res = await collection.orderBy('name', 'asc').get()
        //   const namesList = res.data.map(document => {
        //     return document.name
        //   })
        //   const orderedList = namesList.sort()
        //   let ordered = true
        //   orderedList.forEach((item, index) => {
        //     if (item !== orderedList[index]) {
        //       ordered = false
        //     }
        //   })
        //   assert(ordered === true)
        // })
        // it('Collection - limit()', async () => {
        //   const res = await collection.limit(1).get()
        //   assert(Array.isArray(res.data))
        //   // assert(res.data.length === 1);
        // })
        // it('Collection - skip()', async () => {
        //   const res = await collection.get()
        //   const total = res.data.length
        //   const res1 = await collection.skip(4).get()
        //   assert(Array.isArray(res1.data))
        //   assert(res1.data.length + 4 === total)
        // })
        // it('Collection - update()', async () => {
        //   const res = await collection.where({ name: _.eq('a') }).update({
        //     age: _.inc(10)
        //   })
        //   assert(res.updated === 1)
        // })
        // it('Collection - field', async () => {
        //   const res = await collection.field({ age: 1 }).get()
        //   let hasNameField = false
        //   res.data.forEach(document => {
        //     if (document.name) {
        //       hasNameField = true
        //     }
        //   })
        //   assert(hasNameField === false)
        // })
        // clean()
    })
})

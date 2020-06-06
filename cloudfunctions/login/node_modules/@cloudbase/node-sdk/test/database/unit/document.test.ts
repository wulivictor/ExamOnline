import * as assert from 'power-assert'
import { Util } from '@cloudbase/database/src/util'
import tcb from '../../../src/index'
import * as Config from '../../config.local'
import * as common from '../../common/index'

describe('test/unit/document.test.ts', () => {
    const collName = 'coll-2'
    const docIDGenerated = Util.generateDocId()

    const app = tcb.init(Config)
    const db = app.database()

    const data = [
        { category: 'Web', tags: ['JavaScript', 'C#'] },
        { category: 'Web', tags: ['Go', 'C#'] },
        { category: 'Life', tags: ['Go', 'Python', 'JavaScript'] }
    ]

    beforeAll(async () => {
        await common.safeCollection(db, collName)
        for (let item of data) {
            await db.collection(collName).add([item])
        }
    })

    afterAll(async () => {
        await db
            .collection(collName)
            .where({
                _id: /.*/
            })
            .remove()
    })

    it('API - createCollection', async () => {
        await common.safeCollection(db, collName)
        // const result = await db.createCollection(collName)
        // assert(result)
    })

    it('docID test', () => {
        const document = db.collection(collName).doc(docIDGenerated)
        assert(document.id === docIDGenerated)
    })

    it('API - set data in empty document', async () => {
        const _ = db.command
        const document = await db
            .collection(collName)
            .doc('123123123')
            .set({
                name: 'jude'
            })
        console.log(document)
        assert(document.upsertedId)
        const documents = await db
            .collection(collName)
            .where({
                name: _.eq('jude')
            })
            .get()
        assert(Array.isArray(documents.data))
    })

    it('API - set data in document existed', async () => {
        const documents = await db
            .collection(collName)
            .limit(1)
            .get()
        const docId = documents.data[0]._id
        let data = await db
            .collection(collName)
            .doc(docId)
            .set({
                data: { type: 'set' }
            })
        assert(data.updated === 1)

        data = await db
            .collection(collName)
            .doc(docId)
            .set({
                data: { arr: [1, 2, 3], foo: 123 },
                array: [0, 0, 0]
            })
        assert(data.updated === 1)

        data = await db
            .collection(collName)
            .doc(docId)
            .update({
                data: { arr: db.command.push([4, 5, 6]), foo: db.command.inc(1) },
                array: db.command.pop()
            })
        console.log(data)
        assert.strictEqual(data.updated, 1)
    })

    it('API - remove document that not exist', async () => {
        const document = db.collection(collName).doc(docIDGenerated)
        const data = await document.remove()
        assert(!data.deleted)
    })

    it('API - remove document should success', async () => {
        const documents = await db.collection(collName).get()
        const docId = documents.data[0]._id
        const data = await db
            .collection(collName)
            .doc(docId)
            .remove()
        assert.strictEqual(data.deleted, 1)
    })
})

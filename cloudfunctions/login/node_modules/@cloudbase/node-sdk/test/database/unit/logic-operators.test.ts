import * as assert from 'power-assert'
import tcb from '../../../src/index'
import * as config from '../../config.local'
import * as common from '../../common/index'
import { checkIsGray } from '../../../src/utils/utils'

const app = tcb.init(config)
const db = app.database()
const _ = db.command

const date = new Date()

describe('逻辑操作符', async () => {
    const collName = 'test-projection'
    let passagesCollection = null
    const data = [
        { category: 'Web', tags: ['JavaScript', 'C#'], date },
        { category: 'Web', tags: ['Go', 'C#'] },
        { category: 'Life', tags: ['Go', 'Python', 'JavaScript'] }
    ]

    beforeAll(async () => {
        passagesCollection = await common.safeCollection(db, collName)
        const success = await passagesCollection.create(data)
        assert.strictEqual(success, true)
    })

    afterAll(async () => {
        const success = await passagesCollection.remove()
        assert.strictEqual(success, true)
    })

    it('nor', async () => {
        const result = await db
            .collection(collName)
            .where({
                category: _.nor(_.eq('Life'), _.eq('Web'))
            })
            .get()
        assert.deepStrictEqual(result.data, [])
    })

    // 新db模块解决or date问题，旧db模块未解决，跳过该测试
    if (checkIsGray() || config._useFeature) {
        it('or date', async () => {
            const result = await db
                .collection(collName)
                .where({ date: _.or(date, new Date(date.getTime() + 10000)) })
                .get()

            assert(result.data.length > 0)
        })
    }
})

import { checkIsGray } from '../../src/utils/utils'
import * as config from '../config.local'

export async function safeCreateCollection(db, name) {
    return db.createCollection(name)
}

export async function safeCollection(db, name) {
    const collection = db.collection(name)
    let num = -1

    // 检查collection是否存在
    try {
        await collection.where({}).get()
    } catch (e) {
        if (e.code === 'DATABASE_COLLECTION_NOT_EXIST') {
            // 不存在
            await db.createCollection(name)
        }
    }

    return {
        async create(data) {
            // await db.createCollection(name)
            const datas = Array.isArray(data) ? data : [data]
            num = datas.length

            if (checkIsGray() || config._useFeature) {
                let result
                try {
                    result = await collection.add(datas)
                } catch (e) {
                    console.log('debug:', e)
                    // throw e
                }

                console.log('result:', result)

                // const getRes = await collection.doc(result.id).get()
                // console.log('getRes:', getRes)

                if (result.ids.length !== num) {
                    throw Error('出现插入数据失败情况了！！')
                }
            } else {
                for (let item of datas) {
                    const result = await collection.add(item)
                    if (!result || !result.id) {
                        return false
                    }
                }
            }

            return true
        },
        async remove() {
            const result = await collection
                .where({
                    _id: /.*/
                })
                .remove()
            return result.deleted > 0
        }
    }
}

// module.exports = {
//   safeCreateCollection,
//   safeCollection
// }

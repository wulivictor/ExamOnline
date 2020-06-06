import * as assert from 'power-assert'
import * as Mock from './mock'
import tcb from '../../../src/index'
import * as config from '../../config.local'
import * as common from '../../common/index'
import oldTcb from '../../../node_modules/tcb-admin-node'
import { checkIsGray } from '../../../src/utils/utils'

describe('GEO高级功能', async () => {
    const app = tcb.init(config)
    const oldApp = oldTcb.init(config)
    const db = app.database()
    const oldDb = oldApp.database()
    const { Point, LineString, Polygon, MultiPoint, MultiLineString, MultiPolygon } = db.Geo
    const {
        Point: OldPoint,
        LineString: OldLineString,
        Polygon: OldPolygon,
        MultiPoint: OldMultiPoint,
        MultiLineString: OldMultiLineString,
        MultiPolygon: OldMultiPolygon
    } = oldDb.Geo

    const collName = 'coll-1'
    const collection = db.collection(collName)
    function randomPoint() {
        return new Point(180 - 360 * Math.random(), 90 - 180 * Math.random())
    }

    it('Document - createCollection()', async () => {
        await common.safeCollection(db, collName)
    })

    const geoNearPoint = new Point(0, 0)
    const line = new LineString([randomPoint(), randomPoint()])

    // “回”字的外环
    const point1 = new Point(-2, -2)
    const point2 = new Point(2, -2)
    const point3 = new Point(2, 2)
    const point4 = new Point(-2, 2)
    // “回”字的内环
    const point5 = new Point(-1, -1)
    const point6 = new Point(1, -1)
    const point7 = new Point(1, 1)
    const point8 = new Point(-1, 1)
    const polygon = new Polygon([
        new LineString([point1, point2, point3, point4, point1]),
        new LineString([point5, point6, point7, point8, point5])
    ])

    const multiPoint = new MultiPoint([randomPoint(), randomPoint(), randomPoint(), randomPoint()])
    const multiLineString = new MultiLineString([
        new LineString([randomPoint(), randomPoint()]),
        new LineString([randomPoint(), randomPoint()]),
        new LineString([randomPoint(), randomPoint()]),
        new LineString([randomPoint(), randomPoint()])
    ])
    const multiPolygon = new MultiPolygon([
        new Polygon([new LineString([point1, point2, point3, point4, point1])]),
        new Polygon([new LineString([point5, point6, point7, point8, point5])])
    ])

    const initialData = {
        point: randomPoint(),
        geoNearPoint,
        line,
        polygon,
        multiPoint,
        multiLineString,
        multiPolygon
    }

    it('GEO Advanced - CRUD', async () => {
        // Create
        const res = await collection.add(initialData)
        // const id = res.ids[0]
        const id = res.id
        assert(id)
        assert(res.requestId)

        // // Read
        const readRes = await collection
            .where({
                _id: id
            })
            .get()
        console.log(readRes.data)
        assert(readRes.data.length > 0)
        const data = readRes.data[0]

        if (checkIsGray() || config._useFeature) {
            assert(data.point instanceof Point)
            assert(data.line instanceof LineString)
            assert(data.polygon instanceof Polygon)
            assert(data.multiPoint instanceof MultiPoint)
            assert(data.multiLineString instanceof MultiLineString)
            assert(data.multiPolygon instanceof MultiPolygon)
            assert.deepStrictEqual(data.point, initialData.point)
            assert.deepStrictEqual(data.line, line)
            assert.deepStrictEqual(data.polygon, polygon)
            assert.deepStrictEqual(data.multiPoint, multiPoint)
            assert.deepStrictEqual(data.multiLineString, multiLineString)
            assert.deepStrictEqual(data.multiPolygon, multiPolygon)
        } else {
            assert(data.point instanceof OldPoint)
            assert(data.line instanceof OldLineString)
            assert(data.polygon instanceof OldPolygon)
            assert(data.multiPoint instanceof OldMultiPoint)
            assert(data.multiLineString instanceof OldMultiLineString)
            assert(data.multiPolygon instanceof OldMultiPolygon)
            assert(data.point, initialData.point)
            assert(data.line, line)
            assert(data.polygon, polygon)
            assert(data.multiPoint, multiPoint)
            assert(data.multiLineString, multiLineString)
            assert(data.multiPolygon, multiPolygon)
        }

        // Update
        let result = await collection.doc(id).set(initialData)
        console.log(result)
        assert.strictEqual(result.updated, 1)
        assert(result.requestId)

        // Delete
        const deleteRes = await collection
            .where({
                _id: id
            })
            .remove()
        console.log(deleteRes)
        assert.strictEqual(deleteRes.deleted, 1)
    })

    it('GEO - bad create', () => {
        // bad Point
        assert.throws(() => new Point())
        assert.throws(() => new Point([], {}))

        // bad LineString
        assert.throws(() => new LineString({}))
        assert.throws(() => new LineString([]))
        assert.throws(() => new LineString([123, []]))

        // bad Polygon
        assert.throws(() => new Polygon(null))
        assert.throws(() => new Polygon([]))
        assert.throws(() => new Polygon([666, 789]))
        assert.throws(() => new Polygon([new LineString([point1, point2, point3, point4, point8])]))

        // bad MultiPoint
        assert.throws(() => new MultiPoint({}))
        assert.throws(() => new MultiPoint([]))
        assert.throws(() => new MultiPoint([{}, {}]))

        // bad MultiLineString
        assert.throws(() => new MultiLineString({}))
        assert.throws(() => new MultiLineString([]))
        assert.throws(() => new MultiLineString([123, null]))

        // bad MultiPolygon
        assert.throws(() => new MultiPolygon(123))
        assert.throws(() => new MultiPolygon([]))
        assert.throws(() => new MultiPolygon([666, 666]))
    })

    it('GEO - geoNear', async () => {
        // Create
        const geoPoint = new Point(22, 33)
        const res = await collection.add({
            ...initialData,
            point: geoPoint
        })
        // const id = res.ids[0]
        const id = res.id
        assert(id)
        assert(res.requestId)

        // Read
        const readRes = await collection
            .where({
                point: db.command.geoNear({
                    geometry: geoPoint,
                    maxDistance: 1,
                    minDistance: 0
                })
            })
            .get()
        assert(readRes.data.length > 0)
        if (checkIsGray() || config._useFeature) {
            assert.deepStrictEqual(readRes.data[0].point, geoPoint)
        } else {
            assert(readRes.data[0].point, geoPoint)
        }

        // Delete
        // const deleteRes = await collection
        //     .where({
        //         _id: id
        //     })
        //     .remove()
        // console.log(deleteRes)
        // assert.strictEqual(deleteRes.deleted, 1)
    })

    it('GEO - geoWithin', async () => {
        const res = await collection.add({
            ...initialData,
            point: new Point(0, 0)
        })
        // const id = res.ids[0]
        const id = res.id
        assert(id)
        assert(res.requestId)

        // Read
        const readRes = await collection
            .where({
                point: db.command.geoWithin({
                    geometry: new Polygon([
                        new LineString([point1, point2, point3, point4, point1])
                    ])
                })
            })
            .get()
        console.log(readRes)
        assert(readRes.data.length > 0)
        if (checkIsGray() || config._useFeature) {
            assert.deepStrictEqual(readRes.data[0].point, new Point(0, 0))
        } else {
            assert(readRes.data[0].point, new Point(0, 0))
        }

        // Delete
        const deleteRes = await collection
            .where({
                point: db.command.geoWithin({
                    geometry: new Polygon([
                        new LineString([point1, point2, point3, point4, point1])
                    ])
                })
            })
            .remove()
        console.log(deleteRes)
        assert(deleteRes.deleted >= 1)
    })
})

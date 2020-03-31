import request from "supertest";
import app from "../src/app";
import {container} from "tsyringe";
import {CacheService} from "../src/services"
const cacheService = container.resolve(CacheService);
import {expect} from "chai";

beforeAll(async () => {
    await cacheService.clearCache();
    await cacheService.findByKey('some-key');
});

describe("GET /api/v1/cache/some-key", () => {
    it("should return 200 OK", (done) => {
        return request(app).get("/api/v1/cache/some-key")
            .end(function (err, res) {
                expect(res.status).to.be.equal(200);
                expect(res.body.data).to.include.keys(["value"]);
                done();
            });
    });
});

describe("PUT /api/v1/cache/some-key", () => {
    it("should update cache", (done) => {
        return request(app).put("/api/v1/cache")
            .send({"key": "some-key", "value": "newValue"})
            .end(function (err, res) {
                expect(res.status).to.be.equal(200);
                expect(res.body.data).to.exist;
                expect(res.body.data.value).to.be.eq("newValue");
                done();
            });
    });

});

describe("DELETE /api/v1/cache/some-key", () => {
    it("should delete cache", (done) => {
        return request(app).delete("/api/v1/cache/some-key")
            .end(function (err, res) {
                expect(res.status).to.be.equal(200);
                done();
            });
    });
});

describe("GET /api/v1/keys", () => {
    it("should return 200 OK", (done) => {
        return request(app).get("/api/v1/keys")
            .end(function (err, res) {
                expect(res.status).to.be.equal(200);
                expect(Array.isArray(res.body.data)).to.be.true;
                done();
            });
    });
});

describe("DELETE /api/v1/cache-clear", () => {
    it("should clear cache", (done) => {
        return request(app).delete("/api/v1/cache-clear").end(async function (err, res) {
            expect(res.status).to.be.equal(200);
            const result = await cacheService.findAllKeys();
            expect(result.length).to.be.eq(0);
            done();
        });
    });
});
import { Vector3, Vector, Matrix44, Matrix33, degToRadians } from "../../../../src/internal";

test("Should create only valid Vector3 instances", () => {
    expect(() => new Vector3(4, 1)).toThrowError();
    expect(() => new Vector3(1, -1)).toThrowError();
    const v = new Vector(1, 3, Uint16Array);
    expect(v).toBeInstanceOf(Vector3);
    expect(v.toArray()).toEqual([
        Uint16Array.from([0, 0, 0]),
    ]);
    expect(() => (v as any).checkForValidSize(3, 3)).toThrowError();
    expect(() => (v as any).checkForValidSize(-3, 1)).toThrowError();
    expect(() => (v as any).checkForValidSize(3, 1)).not.toThrowError();
});

test("Should perform mul correctly", () => {
    const v = new Vector(1, 3, [1, 2, 3]);
    expect(v.mulSelf(2).toArray()).toEqual([
        Float64Array.from([2, 4, 6]),
    ]);
    const mul = v.mul(1/2);
    expect(mul).not.toBe(v);
    expect(mul.toArray()).toEqual([
        Float64Array.from([1, 2, 3]),
    ]);
});

test("Should perform matAdd correctly", () => {
    const v = new Vector(1, 3, [1, 2, 3]);
    const add = v.matAdd(v);
    expect(add).not.toBe(v);
    expect(add.toArray()).toEqual([
        Float64Array.from([2, 4, 6]),
    ]);
    expect(v.mulSelf(2).matSubSelf(add)).toBe(v);
    expect(v.toArray()).toEqual([
        Float64Array.from([0, 0, 0]),
    ]);
});

test("Should perform dot product correctly", () => {
    const v = new Vector3(1, 3, [1, 2, 3]);
    expect(() => v.dot(v.transpose())).toThrowError();
    expect(v.dot(v)).toBe(1*1 + 2*2 + 3*3);
});

test("Should perform cross product correctly", () => {
    expect(() => new Vector3(1, 3, [1, 2, 3]).cross(new Vector3(1, 3, [-7, 8, 9]).transpose())).toThrowError();
    expect(new Vector3(1, 3, [1, 2, 3]).cross(new Vector3(1, 3, [-7, 8, 9])).toArray()).toEqual([
        Float64Array.from([-6, -30, 22]),
    ]);
    expect(new Vector3(3, 1, [20, 30, 40]).cross(new Vector3(3, 1, [45, 70, 80])).toArray()).toEqual([
        Float64Array.from([-400]),
        Float64Array.from([200]),
        Float64Array.from([50]),
    ]);
    expect(new Vector3(3, 1, [1, 0, 0]).cross(new Vector3(3, 1, [0, 0, 1])).toArray()).toEqual([
        Float64Array.from([0]),
        Float64Array.from([-1]),
        Float64Array.from([0]),
    ]);
    expect(new Vector3(3, 1, [0, 1, 0]).cross(new Vector3(3, 1, [1, 0, 0])).toArray()).toEqual([
        Float64Array.from([0]),
        Float64Array.from([0]),
        Float64Array.from([-1]),
    ]);
});

test("Should translate point correctly", () => {
    const v = new Vector3(1, 3, [1, 1, 1]);
    expect(v.translate(-2, 1, -1)).toBe(v);
    expect(v.toArray()).toEqual([
        Float64Array.from([-1, 2, 0]),
    ]);
});

test("Should rotate vector correctly", () => {
    const v = new Vector3(1, 3, [1, 0, 0]);
    expect(v.rotate(0, 0, 90)).toBe(v);
    expect(v.vGet(0)).toBeCloseTo(0);
    expect(v.vGet(1)).toBeCloseTo(-1);
    expect(v.vGet(2)).toBeCloseTo(0);

    v.rotate(0, 0, -90);
    expect(v.vGet(0)).toBeCloseTo(1);
    expect(v.vGet(1)).toBeCloseTo(0);
    expect(v.vGet(2)).toBeCloseTo(0);

    v.rotate(0, 180, 0);
    expect(v.vGet(0)).toBeCloseTo(-1);
    expect(v.vGet(1)).toBeCloseTo(0);
    expect(v.vGet(2)).toBeCloseTo(0);

    v.transposeSelf().rotate(0, -180, 0);
    expect(v.vGet(0)).toBeCloseTo(1);
    expect(v.vGet(1)).toBeCloseTo(0);
    expect(v.vGet(2)).toBeCloseTo(0);

    /*
    v.rotate(0, 0, 90).rotate(180, 0, -90);
    expect(v.vGet(0)).toBeCloseTo(-1);
    expect(v.vGet(1)).toBeCloseTo(0);
    expect(v.vGet(2)).toBeCloseTo(0);
    */
});

test("Should scale vector correctly", () => {
    const v = new Vector3(1, 3, [1, 2, 3]);
    expect(v.scale(1, 2, 3)).toBe(v);
    expect(v.toArray()).toEqual([
        Float64Array.from([1, 4, 9]),
    ]);
});

test("Transform Point correctly", () => {
    // test for row major
    const v = new Vector3(3, 1, [0, 0, 0]);
    const transformMatrix = new Matrix44([
        [1, 0, 0, 2],
        [0, 1, 0, 2],
        [0, 0, 1, 2],
        [0, 0, 0, 1],
    ]);
    v.transformPoint(transformMatrix);
    expect(v.toArray()).toEqual([
        Float64Array.from([2]),
        Float64Array.from([2]),
        Float64Array.from([2]),
    ]);
    expect(v.transformPoint(transformMatrix.invert()).toArray()).toEqual([
        Float64Array.from([0]),
        Float64Array.from([0]),
        Float64Array.from([0]),
    ]);

    // test for column major
    v.transposeSelf();
    transformMatrix.transposeSelf();
    v.transformPoint(transformMatrix);
    expect(v.toArray()).toEqual([
        Float64Array.from([2, 2, 2]),
    ]);
    expect(v.transformPoint(transformMatrix.invert()).toArray()).toEqual([
        Float64Array.from([0, 0, 0]),
    ]);
});

test("Transform Vector correctly", () => {
    // test for row major
    const v = new Vector3(3, 1, [1, 0, 0]);
    const transformMatrix = Matrix44.rotatorRowMajor(0, 0, 90 * degToRadians);
    v.transformRowMajorVector(transformMatrix);
    expect(v.vGet(0)).toBeCloseTo(0);
    expect(v.vGet(1)).toBeCloseTo(-1);
    v.transformVector(transformMatrix.invert());
    expect(v.vGet(0)).toBeCloseTo(1);
    expect(v.vGet(1)).toBeCloseTo(0);

    // test for column major
    v.transposeSelf();
    const transformMatrix2 = Matrix33.rotatorColumnMajor(0, 0, 90 * degToRadians);
    v.transformColumnMajorVector(transformMatrix2);
    expect(v.vGet(0)).toBeCloseTo(0);
    expect(v.vGet(1)).toBeCloseTo(-1);
    v.transformColumnMajorVector(transformMatrix2.invert());
    expect(v.vGet(0)).toBeCloseTo(1);
    expect(v.vGet(1)).toBeCloseTo(0);
});

test("Should perform triangle intersection correctly", () => {
    const v0 = new Vector3(3, 1, [0, 0, -50]);
    const v1 = new Vector3(3, 1, [0, 1, -50]);
    const v2 = new Vector3(3, 1, [-1, 0, -50]);
    const origin = new Vector3(3, 1, [0, 0, 0]);
    const direction = new Vector3(3, 1, [
        -0.39411127587967854, -0.39879378608814986, -0.8280337060784246
    ]);
    const A = v1.matSub(v0);
    expect(A.toArray()).toEqual([Float64Array.from([0]), Float64Array.from([1]), Float64Array.from([0])]);
    const B = v2.matSub(v0);
    expect(B.toArray()).toEqual([Float64Array.from([-1]), Float64Array.from([0]), Float64Array.from([0])]);
    const N = A.cross(B);
    expect(N.toArray()).toEqual([Float64Array.from([0]), Float64Array.from([0]), Float64Array.from([1])]);
});
import { Vector } from "../../../src/internal";



test('Should create basic row major 1x3 vector', () => {
    const v = new Vector(1, 3, [1, 2, 3]);
    expect(v.rows()).toBe(1);
    expect(v.cols()).toBe(3);
    expect(v.toArray()).toEqual([Float64Array.from([1, 2, 3])]);
});

test('Should create basic column major 3x1 vector', () => {
    const v = new Vector(3, 1, [1, 2, 3]);
    expect(v.rows()).toBe(3);
    expect(v.cols()).toBe(1);
    expect(v.toArray()).toEqual([Float64Array.from([1]), Float64Array.from([2]), Float64Array.from([3])]);
});

test('Should fail to create vector from invalid matrix', () => {
    expect(() => new Vector(2, 3, [1, 2, 3, 4, 5, 6])).toThrowError();
    expect(() => new Vector(3, 2, [1, 2, 3, 4, 5, 6])).toThrowError();
    expect(() => new Vector(-1, 3, [1, 2, 3])).toThrowError();
    expect(() => new Vector(3, -1, [1, 2, 3])).toThrowError();
    expect(() => new Vector(0, 3, [])).toThrowError();
    expect(() => new Vector(3, 0, [])).toThrowError();
    expect(() => new Vector(0, 0, [])).toThrowError();
});

test('Should create basic vector from Array', () => {
    const v1 = new Vector([Float32Array.from([1, 2, 3])]);
    expect(v1.rows()).toBe(1);
    expect(v1.cols()).toBe(3);
    expect(v1.toArray()).toEqual([Float32Array.from([1, 2, 3])]);
    expect(v1).toBeInstanceOf(Vector);

    const v2 = new Vector([[1], [2], [3]]);
    expect(v2.rows()).toBe(3);
    expect(v2.cols()).toBe(1);
    expect(v2.toArray()).toEqual([Float64Array.from([1]), Float64Array.from([2]), Float64Array.from([3])]);
    expect(v2).toBeInstanceOf(Vector);
});
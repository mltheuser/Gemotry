import { Matrix, Vector } from "../../src/internal";


test('Constructor should work for basic 2x2 Matrix', () => {
    const matrix = new Matrix(2, 2, [1, 2, 3, 4]);
    expect(matrix.rows()).toBe(2);
    expect(matrix.cols()).toBe(2);
    expect(matrix.toArray()).toEqual([
        Float64Array.from([1, 2]),
        Float64Array.from([3, 4]),
    ]);
});

test('Test for typeArraySafety in constructor', () => {
    expect(new Matrix(2, 2, Uint16Array.from([1, 2, 3, 4])).toArray()).toEqual([
        Uint16Array.from([1, 2]),
        Uint16Array.from([3, 4]),
    ]);
    expect(new Matrix(2, 2, Uint16Array.from([1, 2, 3, 4]), Uint8Array).toArray()).toEqual([
        Uint8Array.from([1, 2]),
        Uint8Array.from([3, 4]),
    ]);
    expect(new Matrix(2, 2, [1, 2, 3, 4]).toArray()).toEqual([
        Float64Array.from([1, 2]),
        Float64Array.from([3, 4]),
    ]);
});

test('Constructor should throw error for inappropiate sizes.', () => {
    expect(() => {new Matrix(-1, -4, [1, 2, 3, 4])}).toThrowError();
    expect(() => {new Matrix(-4, -1, [1, 2, 3, 4])}).toThrowError();
});

test('Constructor should throw error if the given dataLength does not match the given size.', () => {
    expect(() => {new Matrix(1, 2, [1, 2, 3, 4])}).toThrowError();
    expect(() => {new Matrix(2, 1, [1, 2, 3, 4])}).toThrowError();
    expect(() => {new Matrix(3, 2, [1, 2, 3, 4])}).toThrowError();
    expect(() => {new Matrix(2, 3, [1, 2, 3, 4])}).toThrowError();
});

test('Should create matrix from basic 2D Array', () => {
    const array = [
        Uint8Array.from([1, 2]),
        Uint32Array.from([3, 4]),
    ];
    const mat = new Matrix(array);
    const MatrixArray = mat.toArray();
    expect(mat.rows()).toBe(2);
    expect(mat.cols()).toBe(2);
    expect(array).not.toBe(MatrixArray);
    expect(MatrixArray).toEqual([
        Uint32Array.from([1, 2]),
        Uint32Array.from([3, 4]),
    ]);
});

test('Test typesafty for 2D arrays', () => {
    expect(new Matrix([Float32Array.from([1, 2]), [3, 4]]).toArray()).toEqual([
        Float64Array.from([1, 2]),
        Float64Array.from([3, 4]),
    ]);
    expect(new Matrix([Float32Array.from([1, 2]), [3, 4]], Uint16Array).toArray()).toEqual([
        Uint16Array.from([1, 2]),
        Uint16Array.from([3, 4]),
    ]);
    expect(new Matrix([Uint8Array.from([1, 2]), Uint16Array.from([3, 4])]).toArray()).toEqual([
        Uint16Array.from([1, 2]),
        Uint16Array.from([3, 4]),
    ]);
    expect(new Matrix([Uint8Array.from([1, 2]), Uint16Array.from([3, 4])], Uint8Array).toArray()).toEqual([
        Uint8Array.from([1, 2]),
        Uint8Array.from([3, 4]),
    ]);
});

test('Should throw error when creating matrix from irregular 2D array', () => {
    expect(() => new Matrix([
        [1, 2, 3],
        [4, 5],
    ])).toThrowError();
    expect(() => new Matrix([
        [1, 2],
        [3, 4],
        [5],
    ])).toThrowError();
});

test('Should create empty Matrix for empty Array.', () => {
    const mat = new Matrix([]);
    expect(mat.rows()).toBe(0);
    expect(mat.cols()).toBe(0);
    expect(mat.toArray()).toEqual([]);
});

test('Should create correct blocks for valid parameters.', () => {
    const array = [
        Float64Array.from([1, 2, 3]),
        Float64Array.from([4, 5, 6]),
        Float64Array.from([7, 8, 9]),
    ];
    const mat = new Matrix(array);
    expect(mat.block(0, 0, 2, 2).toArray()).toEqual(array);
    expect(mat.block(0, 0, 2, 0).toArray()).toEqual([
        Float64Array.from([1]),
        Float64Array.from([4]),
        Float64Array.from([7]),
    ]); 
    expect(mat.block(1, 1, 1, 2).toArray()).toEqual([
        Float64Array.from([5, 6]),
    ]);
});

test('Should throw error to create blocks for invalid parameters.', () => {
    const mat = new Matrix([
        Float64Array.from([1, 2, 3]),
        Float64Array.from([4, 5, 6]),
        Float64Array.from([7, 8, 9]),
    ]);
    expect(() => mat.block(-1, -1, 2, 2)).toThrowError();
    expect(() => mat.block(0, 0, 3, 3)).toThrowError();
    expect(() => mat.block(2, 2, 0, 0)).toThrowError();
    expect(() => new Matrix([]).block(0, 0, 0, 0)).toThrowError();
});

test('Should transpose correctly', () => {
    const array = [
        Float64Array.from([1, 2]),
        Float64Array.from([3, 4]),
        Float64Array.from([5, 6]),
    ];
    const mat = new Matrix(array);
    expect(mat.transposeSelf()).toBe(mat);
    expect(mat.toArray()).toEqual([
        Float64Array.from([1, 3, 5]),
        Float64Array.from([2, 4, 6]),
    ]);
    const transposedOffspring = mat.transpose();
    expect(transposedOffspring).not.toBe(mat);
    expect(transposedOffspring.toArray()).toEqual(array);
});

test('Should invert correctly', () => {
    const mat1 = new Matrix([
        [0, -1, 1],
        [1, 2, -2],
        [2, -1, 0],
    ]);
    const inversion = mat1.invert();
    inversion.matMulSelf(mat1);
    expect(inversion.get(0, 0)).toBeCloseTo(1);
    expect(inversion.get(1, 1)).toBeCloseTo(1);
    expect(inversion.get(2, 2)).toBeCloseTo(1);
    const mat2 = new Matrix([
        [2, -1, 0],
        [1, 2, -2],
        [0, -1, 1],
    ]);
    mat2.matMulSelf(mat2.invert());
    expect(mat2.get(0, 0)).toBeCloseTo(1);
    expect(mat2.get(1, 1)).toBeCloseTo(1);
    expect(mat2.get(2, 2)).toBeCloseTo(1);
    expect(() => {new Matrix([[0, 0], [0, 0]]).invertSelf()}).toThrowError();
});

test('Should multiply by scalar correctly', () => {
    const array = [
        Float64Array.from([1, 2]),
        Float64Array.from([3, 4]),
    ];
    const mat = new Matrix(array);
    expect(mat.mulSelf(2)).toBe(mat);
    expect(mat.toArray()).toEqual([
        Float64Array.from([2, 4]),
        Float64Array.from([6, 8]),
    ]);
    const mulOffspring = mat.mul(1 / 2);
    expect(mulOffspring).not.toBe(mat);
    expect(mulOffspring.toArray()).toEqual(array);
});

test('Should divide by scalar correctly', () => {
    const array = [
        Float64Array.from([1, 2]),
        Float64Array.from([3, 4]),
    ];
    const mat = new Matrix(array);
    expect(mat.divSelf(1 / 2)).toBe(mat);
    expect(mat.toArray()).toEqual([
        Float64Array.from([2, 4]),
        Float64Array.from([6, 8]),
    ]);
    const mulOffspring = mat.div(2);
    expect(mulOffspring).not.toBe(mat);
    expect(mulOffspring.toArray()).toEqual(array);
});

test('Should performe matrixAdd correctly', () => {
    const mat1 = new Matrix([
        Float64Array.from([1, 2]),
        Float64Array.from([3, 4]),
    ]);
    const mat2 = new Matrix([
        Float64Array.from([-1, -2]),
        Float64Array.from([-3, -4]),
    ]);
    expect(mat1.matAddSelf(mat2)).toBe(mat1);
    expect(mat1.toArray()).toEqual([
        Float64Array.from([0, 0]),
        Float64Array.from([0, 0]),
    ]);
    const addOffspring = mat2.matAdd(mat2);
    expect(addOffspring).not.toBe(mat2);
    expect(addOffspring.toArray()).toEqual([
        Float64Array.from([-2, -4]),
        Float64Array.from([-6, -8]),
    ]);
    const v = new Vector([[1, 2]]);
    const result = v.matAdd(v);
    expect(result.toArray()).toEqual([Float64Array.from([2, 4])])
});

test('Should performe matrixMul correctly', () => {
    const mat = new Matrix([
        Float32Array.from([1, 2]),
        Float32Array.from([3, 4]),
    ]);
    const result1 = mat.matMul(mat);
    expect(result1).toBeInstanceOf(Matrix);
    expect(result1).not.toBeInstanceOf(Vector);
    expect(result1.toArray()).toEqual([
        Float32Array.from([7, 10]),
        Float32Array.from([15, 22]),
    ]);
    const v = new Matrix([Int16Array.from([1 , 2])]);
    const result2 = v.matMul(mat, Int8Array);
    expect(result2).toBeInstanceOf(Vector);
    expect(result2.toArray()).toEqual([
        Int8Array.from([7, 10]),
    ]);
    expect(mat.matMul(v.transpose()).toArray()).toEqual([
        Float32Array.from([5]),
        Float32Array.from([11]),
    ]);
    expect(() => v.matMulSelf(v.transpose())).toThrowError();
    v.matMulSelf(mat);
    expect(v.toArray()).toEqual([Int16Array.from([7, 10])]);
});

test('Should allow dot product only for vectors', () => {
    const mat = new Matrix([
        Float64Array.from([1, 2]),
        Float64Array.from([3, 4]),
    ]);
    const v = new Vector([[1], [2]]);
    expect(() => mat.dot(v)).toThrowError();
    const v2 = new Matrix([[1], [2]]);
    expect(v.dot(v2)).toBe(5);
});

test('Should deppClone matrix', () => {
    const mat = new Matrix([
        Float64Array.from([1, 2]),
        Float64Array.from([3, 4]),
    ]);
    const clone = mat.clone();
    expect(clone).not.toBe(mat);
    expect(clone.toArray()).toEqual(mat.toArray());
});
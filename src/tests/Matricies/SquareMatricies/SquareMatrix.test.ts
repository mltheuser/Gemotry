import { SquareMatrix, Matrix22 } from "../../../src/internal";

test("Should create only true squareMatricies", () => {
    expect(() => new SquareMatrix(-2)).toThrowError();
    expect(() => new SquareMatrix([[1, 2, 3], [4, 5, 6]])).toThrowError();
    expect(() => new SquareMatrix(2)).not.toThrowError();
    expect(() => new SquareMatrix(2, [[1, 2], [3, 4]], Uint8Array)).not.toThrowError();
    const sqM = new SquareMatrix(2, Uint16Array);
    expect(sqM).toBeInstanceOf(Matrix22);
    expect(sqM.toArray()).toEqual([
        Uint16Array.from([0, 0]),
        Uint16Array.from([0, 0]),
    ]);
});
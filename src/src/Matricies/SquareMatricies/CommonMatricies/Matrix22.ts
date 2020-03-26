import { CommonMatrix, Matrix, SquareMatrix } from "../../../internal";

export default class Matrix22 extends CommonMatrix {

    /**
     * Returnes a 2D rotation matrix to be used with column major vectors according to the given angle.
     *
     * @param z - Counterclockwise rotation around the implicit z axis in radians
     * @returns 2D rotation matrix
     */
    public static rotatorColumnMajor(z: number) {
        const a = Math.cos(-z), b = Math.sin(-z);
        return new Matrix22([a, b - b, a]);
    }

    /**
     * Returnes a 2D rotation matrix to be used with row major vectors according to the given angle.
     *
     * @param z - Counterclockwise rotation around the implicit z axis in radians
     * @returns 2D rotation matrix
     */
    public static rotatorRowMajor(z: number) {
        const a = Math.cos(-z), b = Math.sin(-z);
        return new Matrix22([a, -b, b, a]);
    }

    protected static isMatrix22(rows: number, cols: number) {
        if (rows === 2 || cols === 2) {
            return true;
        }
        return false;
    }

    constructor(rows: number, cols: number, data?: SupportedDataArray, dataArrayType?: SupportedDataArrayConstructor)
    constructor(rows: number, cols: number, data: Array<SupportedDataArray>, dataArrayType: SupportedDataArrayConstructor)
    constructor(dataArrayType?: SupportedDataArrayConstructor)
    constructor(data?: SupportedDataArray, dataArrayType?: SupportedDataArrayConstructor)
    constructor(data: Array<SupportedDataArray>, dataArrayType?: SupportedDataArrayConstructor)
    public constructor(a?: number | SupportedDataArray | Array<SupportedDataArray> | SupportedDataArrayConstructor, b?: number | SupportedDataArrayConstructor, c?: SupportedDataArray | Array<SupportedDataArray>, d?: SupportedDataArrayConstructor) {
        if (typeof a === "number") {
            super(a, b as number, c as any, d);
        } else {
            super(2, a as any, b as SupportedDataArrayConstructor);
        }
    }

    protected checkForValidSize(rows: number, cols: number) {
        super.checkForValidSize(rows, cols);
        if (!Matrix22.isMatrix22(rows, cols)) {
            throw new EvalError("A valid 2x2 Matrix needs 2 rows and 2 cols.");
        }
    }


}
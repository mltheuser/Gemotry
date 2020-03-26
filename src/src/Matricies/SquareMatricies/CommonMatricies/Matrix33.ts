import { CommonMatrix, Matrix } from "../../../internal";

export default class Matrix33 extends CommonMatrix {

    /**
     * Returnes a 2D rotation matrix to be used with column major vectors according to the given angle.
     *
     * @param z - Counterclockwise rotation around the implicit z axis in radians
     * @returns 2D rotation matrix
     */
    static rotatorColumnMajor(z: number)
    /**
     * Returnes a 3D rotation matrix to be used with column major vectors according to the given angles.
     *
     * @param x - Counterclockwise rotation around the x axis in radians
     * @param y - Counterclockwise rotation around the y axis in radians
     * @param z - Counterclockwise rotation around the z axis in radians
     * @returns 3D rotation matrix
     */
    static rotatorColumnMajor(x: number, y: number, z: number)
    public static rotatorColumnMajor(x: number, y?: number, z?: number) {
        if (y !== undefined) {
            const a = Math.cos(x), b = Math.sin(x);
            const c = Math.cos(y), d = Math.sin(y);
            const e = Math.cos(z), f = Math.sin(z);
            return new Matrix33([c * e, -c * f, d,a * f + b * d * e, -b * d * f + a * e, -b * c,b * f - a * d * e, a * d * f + b * e, a * c]);
        } else {
            const a = Math.cos(-z), b = Math.sin(-z);
            return new Matrix33([a, b, 0, - b, a, 0, 0, 0, 1]);
        }
    }

    /**
     * Returnes a 2D rotation matrix to be used with row major vectors according to the given angle.
     *
     * @param z - Counterclockwise rotation around the implicit z axis in radians
     * @returns 2D rotation matrix
     */
    static rotatorRowMajor(z: number)
    /**
     * Returnes a 3D rotation matrix to be used with row major vectors according to the given angles.
     *
     * @param x - Counterclockwise rotation around the x axis in radians
     * @param y - Counterclockwise rotation around the y axis in radians
     * @param z - Counterclockwise rotation around the z axis in radians
     * @returns 3D rotation matrix
     */
    static rotatorRowMajor(x: number, y: number, z: number)
    public static rotatorRowMajor(x: number, y?: number, z?: number) {
        if (y !== undefined) {
            const a = Math.cos(x), b = Math.sin(x);
            const c = Math.cos(y), d = Math.sin(y);
            const e = Math.cos(z), f = Math.sin(z);
            return new Matrix33([c * e, a * f + b * d * e, b * f - a * d * e, -c * f, -b * d * f + a * e, a * d * f + b * e, d, -b * c, a * c]);
        } else {
            const a = Math.cos(-z), b = Math.sin(-z);
            return new Matrix33([a, -b, 0, b, a, 0, 0, 0, 1])
        }
    }

    protected static isMatrix33(rows: number, cols: number) {
        if (rows === 3 || cols === 3) {
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
            super(3, a as any, b as SupportedDataArrayConstructor);
        }
    }
    
    protected checkForValidSize(rows: number, cols: number) {
        super.checkForValidSize(rows, cols);
        if (!Matrix33.isMatrix33(rows, cols)) {
            throw new EvalError("A valid 3x3 Matrix needs 3 rows and 3 cols.");
        }
    }


}
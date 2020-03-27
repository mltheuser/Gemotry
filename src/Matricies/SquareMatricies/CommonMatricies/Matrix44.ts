import { CommonMatrix, Matrix, SupportedDataArray, SupportedDataArrayConstructor } from "../../../internal";

export default class Matrix44 extends CommonMatrix {

    protected static isMatrix44(rows: number, cols: number) {
        if (rows === 4 || cols === 4) {
            return true;
        }
        return false;
    }

    /**
     * Returnes a 3D rotation matrix to be used with column major vectors according to the given angles.
     *
     * @param x - Counterclockwise rotation around the x axis in radians
     * @param y - Counterclockwise rotation around the y axis in radians
     * @param z - Counterclockwise rotation around the z axis in radians
     * @returns 3D rotation matrix
     */
    public static rotatorColumnMajor(x: number, y: number, z: number) {
        const a = Math.cos(x), b = Math.sin(x);
        const c = Math.cos(y), d = Math.sin(y);
        const e = Math.cos(z), f = Math.sin(z);
        return new Matrix44([c * e, -c * f, d, 0, a * f + b * d * e, -b * d * f + a * e, -b * c, 0, b * f - a * d * e, a * d * f + b * e, a * c, 0, 0, 0, 0, 1]);
    }

    /**
     * Returnes a 3D rotation matrix to be used with row major vectors according to the given angles.
     *
     * @param x - Counterclockwise rotation around the x axis in radians
     * @param y - Counterclockwise rotation around the y axis in radians
     * @param z - Counterclockwise rotation around the z axis in radians
     * @returns 3D rotation matrix
     */
    public static rotatorRowMajor(x: number, y: number, z: number) {
        const a = Math.cos(x), b = Math.sin(x);
        const c = Math.cos(y), d = Math.sin(y);
        const e = Math.cos(z), f = Math.sin(z);
        return new Matrix44([c * e, a * f + b * d * e, b * f - a * d * e, 0, -c * f, -b * d * f + a * e, a * d * f + b * e, 0, d, -b * c, a * c, 0, 0, 0, 0, 1]);
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
            super(4, a as any, b as SupportedDataArrayConstructor);
        }
    }

    protected checkForValidSize(rows: number, cols: number) {
        super.checkForValidSize(rows, cols);
        if (!Matrix44.isMatrix44(rows, cols)) {
            throw new EvalError("A valid 4x4 Matrix needs 4 rows and 4 cols.");
        }
    }

}
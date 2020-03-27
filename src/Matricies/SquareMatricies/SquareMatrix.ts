import { Matrix, Matrix44, Matrix22, Matrix33, SupportedDataArray, SupportedDataArrayConstructor } from "../../internal";

export default class SquareMatrix extends Matrix {

    protected static isSquareMatrix(rows: number, cols: number) {
        if (rows === cols) {
            return true;
        }
        return false;
    }

    constructor(rows: number, cols: number, data?: SupportedDataArray, dataArrayType?: SupportedDataArrayConstructor)
    constructor(rows: number, cols: number, data: Array<SupportedDataArray>, dataArrayType: SupportedDataArrayConstructor)
    constructor(rows: number, cols: number, dataArrayType?: SupportedDataArrayConstructor)
    constructor(size: number, data?: SupportedDataArray, dataArrayType?: SupportedDataArrayConstructor)
    constructor(size: number, data: Array<SupportedDataArray>, dataArrayType: SupportedDataArrayConstructor)
    constructor(size: number, dataArrayType?: SupportedDataArrayConstructor)
    constructor(data: Array<SupportedDataArray>, dataArrayType?: SupportedDataArrayConstructor)
    public constructor(a: number | Array<SupportedDataArray>, b?: number | SupportedDataArray | Array<SupportedDataArray> | SupportedDataArrayConstructor, c?: SupportedDataArray | Array<SupportedDataArray> | SupportedDataArrayConstructor, d?: SupportedDataArrayConstructor) {
        if (typeof b == "number" || a.constructor === Array) {
            super(a as any, b as any, c as any, d);
        } else {
            super(a as number, a as number, b as any, c as SupportedDataArrayConstructor);
        }
    }

    protected checkForValidSize(rows: number, cols: number) {
        super.checkForValidSize(rows, cols);
        if (!SquareMatrix.isSquareMatrix(rows, cols)) {
            throw new EvalError(`Array was converted to a matrix. But this matrix is not a vector. It is of size [${rows},${cols}]`);
        }
    }

    // [not numeric stable yet]
    public invertSelf() {
        const playground = this.playGround;
        this.makeIdentity(playground);

        const rows = this.rows();
        const data = this.data;
        let i = 0, j = 0, z = 0, tmp = 0, factor = 0, preComp01 = 0, preComp02 = 0, preComp03 = 0, preComp04 = 0, preComp05 = 0, preComp06 = 0, preComp07 = 0;
        for (; i < rows; ++i) {
            preComp01 = i * rows;
            preComp02 = preComp01 + i;
            preComp03 = Math.abs(data[preComp02]);
            if (preComp03 < 0.5) { // preCompTest [What is a good epsilon?]
                preComp06 = i;
                for (j = i; j < rows; ++j) {
                    if (i === j) {
                        continue;
                    }
                    preComp04 = Math.abs(data[j * rows + i]);
                    if (preComp03 < preComp04) {
                        preComp03 = preComp04;
                        preComp06 = j;
                    }
                }
                if (preComp06 !== i) {
                    preComp04 = preComp06 * rows;
                    for (z = 0; z < rows; ++z) {
                        preComp05 = preComp01 + z;
                        preComp07 = preComp04 + z;
                        tmp = data[preComp05];
                        data[preComp05] = data[preComp07];
                        data[preComp07] = tmp;
                        tmp = playground[preComp05];
                        playground[preComp05] = playground[preComp07];
                        playground[preComp07] = tmp;
                    }
                }
            }
            if (data[preComp02] === 0) {
                throw new EvalError("No applicable pivot found.");
            }
            factor = data[preComp02];
            for (j = 0; j < rows; ++j) {
                data[preComp01 + j] /= factor;
                playground[preComp01 + j] /= factor;
            }
            for (j = 0; j < rows; ++j) {
                if (j === i) {
                    continue;
                }
                preComp04 = j * rows;
                factor = data[preComp04 + i];
                for (z = 0; z < rows; ++z) {
                    data[preComp04 + z] -= factor * data[preComp01 + z];
                    playground[preComp04 + z] -= factor * playground[preComp01 + z];
                }
            }
        }
        data.set(playground);
        return this;
    }

    // This has do be copied for all leafs so think about an alternative
    protected testForSubClass(rows: number, cols: number): any {
        switch (rows) {
            case 2: 
                return Matrix22;
            case 3:
                return Matrix33
            case 4:
                return Matrix44;
        }
    }

}
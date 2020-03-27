import { Matrix, Vector3, Vector2 } from "../../internal";

export default class Vector extends Matrix {

    protected static isVector(rows: number, cols: number) {
        if (cols === 1 || rows === 1) {
            return true;
        }
        return false;
    }

    protected checkForValidSize(rows: number, cols: number) {
        super.checkForValidSize(rows, cols);
        if (!Vector.isVector(rows, cols)) {
            throw new EvalError(`Array was converted to a matrix. But this matrix is not a vector. It is of size [${rows},${cols}]`);
        }
    }

    /**
     * Returns value at index.
     * @param index 
     */
    public vGet(index: number) {
        return this.data[index];
    }

    /**
     * Returns value at index to new value.
     * @param index 
     * @param value The new value 
     */
    public vSet(index: number, value: number) {
        (this.data as any)[index] = value;
    }
    
    public transposeSelf() {
        const rows = this.rows();
        this.size[0] = this.cols();
        this.size[1] = rows;
        return this;
    }

    public norm(): number {
        let result = 0, i = 0;
        const len = this.data.length;
        for (; i < len; ++i) {
            result += Math.pow(this.data[i], 2);
        }
        return Math.sqrt(result);
    }

    public normalizeSelf() {
        let i = 0;
        const len = this.data.length, norm = this.norm();
        for (; i < len; ++i) {
            this.data[i] /= norm;
        }
        return this;
    }

    public dot(vector: Matrix) {
        Matrix.checkEqualDimensions(this.rows(), this.cols(), vector.rows(), vector.cols());
        let i = 0, len = this.data.length, result = 0;
        for (; i < len; ++i) {
            result += this.data[i] * (vector as Vector).data[i];
        }
        return result;
    }

    protected testForSubClass(rows: number, cols: number): any {
        const majorDim = cols > rows ? cols : rows;
        if (majorDim > 4) {
            return null;
        }
        switch (majorDim) {
            case 2:
                return Vector2;
            case 3:
                return Vector3;
        }
    }

}
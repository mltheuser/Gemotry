import { Vector, SquareMatrix, SupportedDataArrayConstructor, SupportedDataArray, SupportedDataArrayInternal, SupportedSizeArrayInternal } from "../internal";

export default class Matrix {

    /**
     * Returns an identity matrix with given size.
     *
     * @param size - Number of lines and columns
     * @param dataArrayType - Data type for the values of the matrix
     * @returns Identity matrix
     */
    public static identity(size: number, dataArrayType?: SupportedDataArrayConstructor) {
        const result = new SquareMatrix(size, dataArrayType);
        result.makeIdentity(result.data);
        return result;
    }

    /**
     * Checks if a and b have the same number of rows and the same number of cols.
     * 
     * @param aRows Rows of matrix a
     * @param aCols Cols of matrix a
     * @param bRows Rows of matrix b
     * @param bCols Cols of matrix b
     * 
     * @throws {EvalError} If the check failes. 
     */
    public static checkEqualDimensions(aRows: number, aCols: number, bRows: number, bCols: number) {
        if (aRows !== bRows || aCols !== bCols) {
            throw new EvalError("The matrices must have the same dimension.");
        }
    }

    protected static isNumberArray(data: SupportedDataArray | Array<SupportedDataArray>) {
        return data instanceof Array && typeof data[0] !== "number";
    }

    private static findApplicableDataArrayType(array: Array<SupportedDataArray>) {
        if (array[0] instanceof Array) {
            return Float64Array;
        }
        const rows = array.length;
        let arrayType = (Object.getPrototypeOf(array[0])).constructor as SupportedDataArrayConstructor;
        for (let i = 1; i < rows; ++i) {
            if (array[i] instanceof Array) {
                return Float64Array;
            }
            const competitor = (Object.getPrototypeOf(array[i]).constructor as SupportedDataArrayConstructor);
            if (competitor.BYTES_PER_ELEMENT >= 8) {
                return Float64Array;
            }
            if (competitor.BYTES_PER_ELEMENT > arrayType.BYTES_PER_ELEMENT) {
                arrayType = competitor;
            }
        }
        return arrayType;
    }

    private static findApplicableSizeArrayType(rows: number, cols: number) {
        const max = rows > cols ? rows : cols;
        if (max <= 255) {
            return Uint8Array;
        } else if (max <= 65535) {
            return Uint16Array;
        } else if (max < 4294967295) {
            return Uint32Array;
        } else {
            throw new EvalError("One of the dimensions of the array exceeds the limit of 4294967295");
        }
    }

    private static parse(rows: number, cols: number, data: SupportedDataArray | Array<SupportedDataArray>, dataArrayType: SupportedDataArrayConstructor, instance: Matrix) {
        const subClass = instance.testForSubClass(rows, cols);
        if (subClass) {
            return new subClass(rows, cols, data, dataArrayType);
        }
        instance.allocateMemeory(rows, cols, dataArrayType);
        instance.assignSize(rows, cols);
        if (Matrix.isNumberArray(data)) {
            instance.assign2DArray(data as Array<SupportedDataArray>);
        } else {
            instance.assignFlatArray(data as SupportedDataArray);
        }
    }

    private static parseByGivenSize(rows: number, cols: number, data: SupportedDataArray | Array<SupportedDataArray>, dataArrayType: SupportedDataArrayConstructor, instance: Matrix) {
        if (!dataArrayType) {
            if (!data || data instanceof Array) {
                dataArrayType = Float64Array;
            } else {
                dataArrayType = Object.getPrototypeOf(data).constructor;
            }
        }
        return Matrix.parse(rows, cols, data, dataArrayType, instance);
    }

    private static parse2DArray(array: Array<SupportedDataArray>, dataArrayType: SupportedDataArrayConstructor, instance: Matrix) {
        let rows = array.length;
        let cols = 0;
        if (!array[0] || array[0].length === 0) {
            rows = 0;
            dataArrayType = Float64Array;
        } else {
            cols = array[0].length;
            if (!dataArrayType) {
                dataArrayType = this.findApplicableDataArrayType(array);
            }
        }
        return this.parse(rows, cols, array, dataArrayType, instance);
    }

    protected data: SupportedDataArrayInternal;

    protected playGround: SupportedDataArrayInternal;

    protected size: SupportedSizeArrayInternal;

    private objectConstructor: (rows: number, cols: number, data?: SupportedDataArrayInternal, arrayType?: SupportedDataArrayConstructor) => void;

    protected dataArrayConstructor: SupportedDataArrayConstructor;

    constructor(rows: number, cols: number, data?: SupportedDataArray, dataArrayType?: SupportedDataArrayConstructor)
    constructor(rows: number, cols: number, data: Array<SupportedDataArray>, dataArrayType: SupportedDataArrayConstructor)
    constructor(rows: number, cols: number, dataArrayType?: SupportedDataArrayConstructor)
    constructor(data: Array<SupportedDataArray>, dataArrayType?: SupportedDataArrayConstructor)
    public constructor(a: number | Array<SupportedDataArray>, b: number | SupportedDataArrayConstructor, c?: SupportedDataArray | Array<SupportedDataArray> | SupportedDataArrayConstructor, d?: SupportedDataArrayConstructor) {
        if (a.constructor === Array) {
            return Matrix.parse2DArray(a as Array<SupportedDataArray>, b as SupportedDataArrayConstructor, this);
        } else {
            if (!c || c.constructor !== Function) {
                return Matrix.parseByGivenSize(a as number, b as number, c as any, d, this);
            } else {
                return Matrix.parseByGivenSize(a as number, b as number, undefined, c as SupportedDataArrayConstructor, this);
            }
        }
    }

    /**
     * Returns the number of rows.
     * 
     * @returns Number of rows
     */
    public rows() {
        return this.size[0];
    }

    /**
     * Returns the number of cols.
     * 
     * @returns Number of cols
     */
    public cols() {
        return this.size[1];
    }

    /**
     * Returns the value at position (row, col) in the matrix.
     * 
     * @param row The row index
     * @param col The col index
     */
    public get(row: number, col: number) {
        this.checkIfPositionInRange(row, col);
        return this.data[col + row * this.cols()];
    }

    /**
     * Sets the value at position (row, col) to the given value.
     * 
     * @param row The row index
     * @param col The col index
     * @param value The new value
     */
    public set(row: number, col: number, value: number) {
        this.checkIfPositionInRange(row, col);
        (this.data as any)[col + row * this.cols()] = value;
    }

    /**
     * Returns a copy of the specified block.
     * 
     * @param topLeftRow 
     * @param topLeftColumn 
     * @param bottomRightRow 
     * @param bottomRightColumn 
     * @returns {Matrix}
     */
    public block(topLeftRow: number, topLeftColumn: number, bottomRightRow: number, bottomRightColumn: number) {
        const rows = bottomRightRow - topLeftRow + 1;
        const cols = bottomRightColumn - topLeftColumn + 1;
        const tCols = this.cols();
        if (rows <= 0 || cols <= 0 || rows > this.rows() || cols > tCols) {
            throw new EvalError("");
        }
        const data = this.data;
        const block = new this.dataArrayConstructor(rows * cols);
        let j = 0, pre = 0;
        for (let i = 0; i < rows; ++i) {
            j = 0;
            pre = (topLeftRow + i) * tCols + topLeftColumn;
            for (; j < cols; ++j) {
                block[j + i * cols] = data[pre + j];
            }
        }
        return new Matrix(rows, cols, block);
    }

    /**
     * DeepClones the matrix.
     * 
     * @param dataArrayType The data type to be used with the clone
     */
    public clone(dataArrayType?: SupportedDataArrayConstructor) {
        return new (this.getObjectConstructor())(
            this.rows(),
            this.cols(),
            this.data,
            dataArrayType,
        ) as this;
    }

    /**
     * Transposes the matrix
     */
    public transposeSelf() {
        const rows = this.rows();
        const cols = this.cols();
        const data = this.data;
        const playGround = this.playGround;
        let j = 0, pre = 0;
        for (let i = 0; i < rows; ++i) {
            j = 0;
            pre = i * cols;
            for (let j = 0; j < cols; ++j) {
                playGround[i + j * rows] = data[j + pre];
            }
        }
        data.set(playGround);
        this.size[0] = cols;
        this.size[1] = rows;
        return this;
    }

    /**
     * Returns a new matrix equal to the transposition of the current matrix
     */
    public transpose() {
        return this.clone().transposeSelf();
    }

    /**
     * Inverts matrix
     */
    public invertSelf(): this {
        throw new EvalError("Can not invert non square matrix.");
    }

    /**
     * Returns new matrix equal to the inversion of the current matrix.
     */
    public invert(): this {
        return this.clone().invertSelf();
    }

    /**
     * Multiplies all elements of the matrix by the given scalar.
     * @param scalar
     */
    public mulSelf(scalar: number) {
        for (let i = 0, len = this.data.length; i < len; ++i) {
            this.data[i] = this.data[i] * scalar;
        }
        return this;
    }

    /**
     * Returns new matrix equal to the scalar-multiplication with the current matrix.
     * @param scalar 
     */
    public mul(scalar: number) {
        return this.clone().mulSelf(scalar);
    }

    public divSelf(scalar: number) {
        return this.mulSelf(1 / scalar);
    }

    public div(scalar: number) {
        return this.mul(1 / scalar);
    }

    /**
     * Adds the specified matrix to the current.
     * @param matrix A matrix with equal dimensions
     */
    public matAddSelf(matrix: Matrix) {
        Matrix.checkEqualDimensions(this.rows(), this.cols(), matrix.rows(), matrix.cols());
        for (let i = 0, len = this.data.length; i < len; ++i) {
            this.data[i] = this.data[i] + matrix.data[i];
        }
        return this;
    }

    /**
     * Returns a new matrix equal to the matrixAddition between the current and the given matrix.
     * @param matrix 
     * @param resultDataArrayType 
     */
    public matAdd(matrix: Matrix, resultDataArrayType?: SupportedDataArrayConstructor) {
        return this.clone(
            this.findApplicableConnectionDataArrayType(matrix, resultDataArrayType)
        ).matAddSelf(matrix);
    }

    public matSubSelf(matrix: Matrix) {
        Matrix.checkEqualDimensions(this.rows(), this.cols(), matrix.rows(), matrix.cols());
        for (let i = 0, len = this.data.length; i < len; ++i) {
            this.data[i] = this.data[i] - matrix.data[i];
        }
        return this;
    }

    public matSub(matrix: Matrix, resultDataArrayType?: SupportedDataArrayConstructor) {
        return this.clone(
            this.findApplicableConnectionDataArrayType(matrix, resultDataArrayType)
        ).matSubSelf(matrix);
    }

    /**
     * Multiplies current matrix with the given one.
     * @param matrix A matrix with equal dimensions
     */
    public matMulSelf(matrix: Matrix) {
        Matrix.checkEqualDimensions(this.rows(), this.cols(), this.rows(), matrix.cols());
        this.runMatMul(this.playGround, this, matrix);
        this.data.set(this.playGround);
        return this;
    }

    /**
     * Returns the multiplication result between this and the given matrix.
     * @param matrix A matrix with as many rows as this matrix has columns.
     */
    public matMul(matrix: Matrix, resultDataArrayType?: SupportedDataArrayConstructor) {
        const result = new Matrix(
            this.rows(),
            matrix.cols(),
            this.findApplicableConnectionDataArrayType(matrix, resultDataArrayType),
        ) as this;
        this.runMatMul(result.data, this, matrix);
        return result;
    }

    private runMatMul(resultData: SupportedDataArray, a: Matrix, b: Matrix) {
        const aRows = a.rows();
        const aCols = a.cols();
        const bRows = b.rows();
        const bCols = b.cols();
        if (aCols !== bRows) {
            throw new EvalError("A has to have as many cols as B rows.");
        }
        const aData = a.data;
        const bData = b.data;
        let i = 0, k = 0, j = 0;
        let entry = 0, aColPre = 0;
        for (; i < aRows; ++i) {
            k = 0;
            for (; k < bCols; ++k) {
                entry = 0;
                aColPre = i * aCols;
                j = 0;
                for (; j < aCols; ++j) {
                    entry += aData[aColPre + j] * bData[j * bCols + k];
                }
                resultData[i * bCols + k] = entry;
            }
        }
    }

    /**
     * Returns the standart norm.
     */
    public norm(): number {
        throw new EvalError("Norm is currently not defiend for Matrix.");
    }

    /**
     * Normalizes the current matrix using the standart norm.
     */
    public normalizeSelf(): Matrix {
        throw new EvalError("Norm is currently not defiend for Matrix.");
    }

    /**
     * Returns a new matrix equal to the normalized current matrix.
     */
    public normalize() {
        return this.clone().normalizeSelf();
    }

    /**
     * Returns the dot product between this and the given vector.
     * @param vector A vector of equal size
     * @returns {number}
     */
    public dot(vector: Matrix): number {
        throw new EvalError("Dot product is only defined for vectors.");
    }

    /**
     * Returns a new vector equal to the cross product between this and the given vector.
     * @param vector A vector of equal size
     * @returns {number}
     */
    public cross(vector: Matrix, resultDataArrayType?: SupportedDataArrayConstructor): Vector {
        throw new EvalError("Dot product is not implemented or defined for this matrix type.");
    }

    /**
     * Returns an array representing the current matrix.
     */
    public toArray() {
        const rows = this.rows();
        const cols = this.cols();
        const resultBuffer = new this.dataArrayConstructor(this.data);
        const result: SupportedDataArrayInternal[] = new Array(rows);
        for (let i = 0; i < rows; ++i) {
            result[i] = new this.dataArrayConstructor(resultBuffer.buffer, i * cols * this.dataArrayConstructor.BYTES_PER_ELEMENT, cols);
        }
        return result;
    }

    protected makeIdentity(data: SupportedDataArrayInternal) {
        const rows = this.rows();
        const cols = this.cols();
        for (let i = 0; i < rows; ++i) {
            data[i * cols + i] = 1;
        }
    }

    protected allocateMemeory(rows: number, cols: number, dataArrayType: SupportedDataArrayConstructor) {
        const sizeArrayType = Matrix.findApplicableSizeArrayType(rows, cols);
        const elementCount = rows * cols;
        const bytesForSize = 2 * sizeArrayType.BYTES_PER_ELEMENT;
        const bytesForData = elementCount * dataArrayType.BYTES_PER_ELEMENT;
        const buffer = new ArrayBuffer(2 * bytesForData + bytesForSize);
        this.data = new dataArrayType(buffer, 0, elementCount);
        this.playGround = new dataArrayType(buffer, bytesForData, elementCount);
        this.size = new sizeArrayType(buffer, 2 * bytesForData, 2);

        this.dataArrayConstructor = dataArrayType;
    }

    protected assignSize(rows: number, cols: number) {
        this.checkForValidSize(rows, cols);
        this.size[0] = rows;
        this.size[1] = cols;
    }

    protected assignFlatArray(data: SupportedDataArray) {
        if (data) {
            if (this.rows() * this.cols() !== data.length) {
                throw new EvalError("The lenght of data does not match the given size.");
            }
            this.data.set(data as SupportedDataArrayInternal);
        }
    }

    protected assign2DArray(data: Array<SupportedDataArray>) {
        const rows = this.rows();
        if (rows !== data.length) {
            throw new EvalError("The given array can not be parsed to a matrix. The given size does not match the given array structure.");
        }
        const cols = this.cols();
        for (let i = 0; i < rows; ++i) {
            if (!data[i] || (data[i] as SupportedDataArray).length !== cols) {
                throw new EvalError("The given array can not be parsed to a matrix. Not all rows have the same number of elements.");
            }
            this.data.set(data[i] as SupportedDataArray, i * cols);
        }
    }

    protected testForSubClass(rows: number, cols: number): any {
        if ((Vector as any).isVector(rows, cols)) {
            return Vector;
        }
        if ((SquareMatrix as any).isSquareMatrix(rows, cols)) {
            return SquareMatrix;
        }
    }

    protected checkForValidSize(rows: number, cols: number): void {
        if (rows < 0 || cols < 0) {
            throw new EvalError("The dimensions of a matrix are expected to be integers.");
        }
    }

    protected findApplicableConnectionDataArrayType(matrix: Matrix, resultDataArrayType?: SupportedDataArrayConstructor) {
        if (!resultDataArrayType) {
            resultDataArrayType = matrix.dataArrayConstructor.BYTES_PER_ELEMENT > this.dataArrayConstructor.BYTES_PER_ELEMENT ?
                matrix.dataArrayConstructor : this.dataArrayConstructor;
        }
        return resultDataArrayType;
    }

    private checkIfPositionInRange(row: number, col: number) {
        if (row < 0 || row > this.rows()) {
            throw new EvalError(`Row is not in the expected Range of [0, ${this.rows()}]`);
        }
        if (col < 0 || col > this.cols()) {
            throw new EvalError(`Col is not in the expected Range of [0, ${this.cols()}]`);
        }
    }

    private getObjectConstructor() {
        if (!this.objectConstructor) {
            this.objectConstructor = Object.getPrototypeOf(this).constructor;
        }
        return this.objectConstructor;
    }

}
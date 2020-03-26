import { Vector, Matrix, Matrix33, degToRadians } from "../../../internal";
import CommonVector from "./CommonVector";
import Matrix44 from "../../SquareMatricies/CommonMatricies/Matrix44";

export default class Vector3 extends CommonVector {

    protected static isVector3(rows: number, cols: number) {
        if (rows === 3 || cols === 3) {
            return true;
        }
        return false;
    }

    protected checkForValidSize(rows: number, cols: number) {
        super.checkForValidSize(rows, cols);
        if (!Vector3.isVector3(rows, cols)) {
            throw new EvalError("An instance of Vector3 must have 3 elements.");
        }
    }

    public mulSelf(factor: number) {
        this.data[0] = this.data[0] * factor;
        this.data[1] = this.data[1] * factor;
        this.data[2] = this.data[2] * factor;
        return this;
    }

    public matAddSelf(vector: Vector3) {
        this.data[0] = this.data[0] + vector.data[0];
        this.data[1] = this.data[1] + vector.data[1];
        this.data[2] = this.data[2] + vector.data[2];
        return this;
    }

    public matSubSelf(vector: Vector3) {
        this.data[0] = this.data[0] - vector.data[0];
        this.data[1] = this.data[1] - vector.data[1];
        this.data[2] = this.data[2] - vector.data[2];
        return this;
    }

    public dot(vector: Vector3) {
        Matrix.checkEqualDimensions(this.rows(), this.cols(), vector.rows(), vector.cols());
        const tData = this.data, vData = vector.data;
        return tData[0] * vData[0] + tData[1] * vData[1] + tData[2] * vData[2];
    }

    public cross(vector: Vector3, resultDataArrayType?: SupportedDataArrayConstructor) {
        const tData = this.data, vData = vector.data, rows = this.rows(), cols = this.cols();
        Matrix.checkEqualDimensions(rows, cols, vector.rows(), vector.cols());
        const result = new Vector3(
            rows, 
            cols,
            this.findApplicableConnectionDataArrayType(vector, resultDataArrayType)
        );
        result.data[0] = tData[1] * vData[2] - tData[2] * vData[1];
        result.data[1] = tData[2] * vData[0] - tData[0] * vData[2];
        result.data[2] = tData[0] * vData[1] - tData[1] * vData[0];
        return result;
    }

    public translate(x: number, y: number, z: number) {
        const data = this.data;
        data[0] += x;
        data[1] += y;
        data[2] += z;
        return this;
    }

    public rotate(x: number, y: number, z: number) {
        return this.rotateDeg(x, y, z);
    }

    public rotateDeg(x: number, y: number, z: number) {
        x *= degToRadians;
        y *= degToRadians;
        z *= degToRadians;
        return this.rotateRad(x, y, z);
    }

    public rotateRad(x: number, y: number, z: number) {
        if (this.cols() === 3) {
            this.transformColumnMajorVector(Matrix33.rotatorColumnMajor(x, y, z));
        } else {
            this.transformRowMajorVector(Matrix33.rotatorRowMajor(x, y, z));
        }
        return this;
    }

    public scale(x: number, y: number, z: number) {
        const data = this.data;
        data[0] *= x;
        data[1] *= y;
        data[2] *= z;
        return this;
    }

    public transformPoint(transformationMatrix: Matrix44) {
        return super.transformPoint(transformationMatrix);
    };

    public transformColumnMajorPoint(transformationMatrix: Matrix44) {
        const vData = this.data, vPlayGround = this.playGround, mData = (transformationMatrix as any).data as SupportedDataArrayInternal;
        const w = vData[0] * mData[3] + vData[1] * mData[7] + vData[2] * mData[11] + mData[15];
        vPlayGround[0] = (vData[0] * mData[0] + vData[1] * mData[4] + vData[2] * mData[8] + mData[12]) / w;
        vPlayGround[1] = (vData[0] * mData[1] + vData[1] * mData[5] + vData[2] * mData[9] + mData[13]) / w;
        vPlayGround[2] = (vData[0] * mData[2] + vData[1] * mData[6] + vData[2] * mData[10] + mData[14]) / w;
        vData.set(vPlayGround);
        return this;
    };

    public transformRowMajorPoint(transformationMatrix: Matrix44) {
        const vData = this.data, vPlayGround = this.playGround, mData = (transformationMatrix as any).data as SupportedDataArrayInternal;
        const w = vData[0] * mData[12] + vData[1] * mData[13] + vData[2] * mData[14] + mData[15];
        vPlayGround[0] = (vData[0] * mData[0] + vData[1] * mData[1] + vData[2] * mData[2] + mData[3]) / w;
        vPlayGround[1] = (vData[0] * mData[4] + vData[1] * mData[5] + vData[2] * mData[6] + mData[7]) / w;
        vPlayGround[2] = (vData[0] * mData[8] + vData[1] * mData[9] + vData[2] * mData[10] + mData[11]) / w;
        vData.set(vPlayGround);
        return this;
    };

    public transformVector(transformationMatrix: Matrix33 | Matrix44) {
        return super.transformVector(transformationMatrix);
    }

    public transformColumnMajorVector(transformationMatrix: Matrix33 | Matrix44) {
        const vData = this.data, vPlayGround = this.playGround, mData = (transformationMatrix as any).data as SupportedDataArrayInternal;
        if (transformationMatrix instanceof Matrix33) {
            vPlayGround[0] = vData[0] * mData[0] + vData[1] * mData[3] + vData[2] * mData[6];
            vPlayGround[1] = vData[0] * mData[1] + vData[1] * mData[4] + vData[2] * mData[7];
            vPlayGround[2] = vData[0] * mData[2] + vData[1] * mData[5] + vData[2] * mData[8];
        } else {
            vPlayGround[0] = vData[0] * mData[0] + vData[1] * mData[4] + vData[2] * mData[8];
            vPlayGround[1] = vData[0] * mData[1] + vData[1] * mData[5] + vData[2] * mData[9];
            vPlayGround[2] = vData[0] * mData[2] + vData[1] * mData[6] + vData[2] * mData[10];
        }
        vData.set(vPlayGround);
        return this;
    };

    public transformRowMajorVector(transformationMatrix: Matrix33 | Matrix44) {
        const vData = this.data, vPlayGround = this.playGround, mData = (transformationMatrix as any).data as SupportedDataArrayInternal;
        if (transformationMatrix instanceof Matrix33) {
            vPlayGround[0] = vData[0] * mData[0] + vData[1] * mData[1] + vData[2] * mData[2];
            vPlayGround[1] = vData[0] * mData[3] + vData[1] * mData[4] + vData[2] * mData[5];
            vPlayGround[2] = vData[0] * mData[6] + vData[1] * mData[7] + vData[2] * mData[8];
        } else {
            vPlayGround[0] = vData[0] * mData[0] + vData[1] * mData[1] + vData[2] * mData[2];
            vPlayGround[1] = vData[0] * mData[4] + vData[1] * mData[5] + vData[2] * mData[6];
            vPlayGround[2] = vData[0] * mData[8] + vData[1] * mData[9] + vData[2] * mData[10];
        }
        vData.set(vPlayGround);
        return this;
    }

}
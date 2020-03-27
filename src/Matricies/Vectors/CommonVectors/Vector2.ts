import { Matrix, Matrix33, degToRadians, Matrix22, SupportedDataArrayInternal } from "../../../internal";
import CommonVector from "./CommonVector";

export default class Vector2 extends CommonVector {

    protected static isVector2(rows: number, cols: number) {
        if (rows === 2 || cols === 2) {
            return true;
        }
        return false;
    }

    protected checkForValidSize(rows: number, cols: number) {
        super.checkForValidSize(rows, cols);
        if (!Vector2.isVector2(rows, cols)) {
            throw new EvalError("An instance of Vector2 must have 2 elements.");
        }
    }

    public mulSelf(factor: number) {
        this.data[0] = this.data[0] * factor;
        this.data[1] = this.data[1] * factor;
        return this;
    }

    public matAddSelf(vector: Vector2) {
        this.data[0] = this.data[0] + vector.data[0];
        this.data[1] = this.data[1] + vector.data[1];
        return this;
    }

    public matSubSelf(vector: Vector2) {
        this.data[0] = this.data[0] - vector.data[0];
        this.data[1] = this.data[1] - vector.data[1];
        return this;
    }

    public dot(vector: Vector2) {
        Matrix.checkEqualDimensions(this.rows(), this.cols(), vector.rows(), vector.cols());
        return this.data[0] * (vector as Vector2).data[0]
            + this.data[1] * (vector as Vector2).data[1];
    }

    public translate(x: number, y: number) {
        const data = this.data;
        data[0] += x;
        data[1] += y;
        return this;
    }

    public rotate(z: number) {
        return this.rotateDeg(z);
    }

    public rotateDeg(z: number) {
        z *= degToRadians;
        return this.rotateRad(z);
    }

    public rotateRad(z: number) {
        if (this.cols() === 2) {
            this.transformColumnMajorVector(Matrix22.rotatorColumnMajor(z));
        } else {
            this.transformRowMajorVector(Matrix22.rotatorRowMajor(z));
        }
        return this;
    }

    public scale(x: number, y: number) {
        const data = this.data;
        data[0] *= x;
        data[1] *= y;
        return this;
    }

    public transformPoint(transformationMatrix: Matrix33) {
        return super.transformPoint(transformationMatrix);
    };

    public transformColumnMajorPoint(transformationMatrix: Matrix33) {
        const vData = this.data, vPlayGround = this.playGround, mData = (transformationMatrix as any).data as SupportedDataArrayInternal;
        const w = vData[0] * mData[2] + vData[1] * mData[5] + mData[8];
        vPlayGround[0] = (vData[0] * mData[0] + vData[1] * mData[3] + mData[6]) / w;
        vPlayGround[1] = (vData[0] * mData[1] + vData[1] * mData[4] + mData[7]) / w;
        vData.set(vPlayGround);
        return this;
    };

    public transformRowMajorPoint(transformationMatrix: Matrix33) {
        const vData = this.data, vPlayGround = this.playGround, mData = (transformationMatrix as any).data as SupportedDataArrayInternal;
        const w = vData[0] * mData[6] + vData[1] * mData[7] + mData[8];
        vPlayGround[0] = (vData[0] * mData[0] + vData[1] * mData[1] + mData[2]) / w;
        vPlayGround[1] = (vData[0] * mData[3] + vData[1] * mData[4] + mData[5]) / w;
        vData.set(vPlayGround);
        return this;
    };

    public transformVector(transformationMatrix: Matrix22 | Matrix33) {
        return super.transformVector(transformationMatrix);
    }

    public transformColumnMajorVector(transformationMatrix: Matrix22 | Matrix33) {
        const vData = this.data, vPlayGround = this.playGround, mData = (transformationMatrix as any).data as SupportedDataArrayInternal;
        if (transformationMatrix instanceof Matrix22) {
            vPlayGround[0] = vData[0] * mData[0] + vData[1] * mData[2];
            vPlayGround[1] = vData[0] * mData[1] + vData[1] * mData[3];
        } else {
            vPlayGround[0] = vData[0] * mData[0] + vData[1] * mData[3];
            vPlayGround[1] = vData[0] * mData[1] + vData[1] * mData[4];
        }
        vData.set(vPlayGround);
        return this;
    };

    public transformRowMajorVector(transformationMatrix: Matrix22 | Matrix33) {
        const vData = this.data, vPlayGround = this.playGround, mData = (transformationMatrix as any).data as SupportedDataArrayInternal;
        if (transformationMatrix instanceof Matrix22) {
            vPlayGround[0] = vData[0] * mData[0] + vData[1] * mData[1];
            vPlayGround[1] = vData[0] * mData[2] + vData[1] * mData[3];
        } else {
            vPlayGround[0] = vData[0] * mData[0] + vData[1] * mData[1];
            vPlayGround[1] = vData[0] * mData[3] + vData[1] * mData[4];
        }
        vData.set(vPlayGround);
        return this;
    }

}
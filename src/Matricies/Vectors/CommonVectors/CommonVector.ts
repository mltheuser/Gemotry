import { Vector, CommonMatrix } from "../../../internal";

export default abstract class CommonVector extends Vector {

    public transformPoint(transformationMatrix: CommonMatrix): this {
        if (this.cols() > this.rows()) {
            return this.transformColumnMajorPoint(transformationMatrix);
        } else {
            return this.transformRowMajorPoint(transformationMatrix);
        }
    }

    public abstract transformColumnMajorPoint(transformationMatrix: CommonMatrix): this;

    public abstract transformRowMajorPoint(transformationMatrix: CommonMatrix): this;

    public transformVector(transformationMatrix: CommonMatrix): this {
        if (this.cols() > this.rows()) {
            return this.transformColumnMajorVector(transformationMatrix);
        } else {
            return this.transformRowMajorVector(transformationMatrix);
        }
    }

    public abstract transformColumnMajorVector(transformationMatrix: CommonMatrix): this;

    public abstract transformRowMajorVector(transformationMatrix: CommonMatrix): this;

    public abstract translate(...directions: number[]): this;

    public abstract rotateRad(...directions: number[]): this;

    public abstract rotateDeg(...directions: number[]): this;

    public abstract rotate(...directions: number[]): this;

    public abstract scale(...directions: number[]): this;

    protected testForSubClass(rows: number, cols: number): any {}

}
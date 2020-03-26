import { SquareMatrix, Matrix } from "../../../internal";

export default abstract class CommonMatrix extends SquareMatrix {

    protected testForSubClass(rows: number, cols: number): any {}

}
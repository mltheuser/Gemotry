import { Matrix, Vector, Vector3, Vector2, Matrix33, SquareMatrix, Matrix22 } from "./src/internal";

function main() {
    
    const v = new Vector3(1, 3, [1, 0, 0]);
    console.log(v.toArray());
    v.rotate(0, 0, 90).rotate(180, 0, 90);
    console.log(v.toArray());

}

main();
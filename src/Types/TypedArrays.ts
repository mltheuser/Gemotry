export type SupportedDataArrayConstructor = Int8ArrayConstructor | Uint8ArrayConstructor | Int16ArrayConstructor | Uint16ArrayConstructor | Int32ArrayConstructor | Uint32ArrayConstructor | Uint8ClampedArrayConstructor | Float32ArrayConstructor | Float64ArrayConstructor;

export type SupportedSizeArrayInternal = Uint8Array | Uint16Array | Uint32Array;

export type SupportedSizeArrayConstructor = Uint8ArrayConstructor | Uint16ArrayConstructor | Uint32ArrayConstructor;

export type SupportedDataArrayInternal = Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array;

export type SupportedDataArray = SupportedDataArrayInternal | Array<number>;
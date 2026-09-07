export const CURVE_TYPE = ['interpolation', 'hermite', 'bezier', 'bspline', 'catmull rom']  as const;
export type CurveType = (typeof CURVE_TYPE)[number];
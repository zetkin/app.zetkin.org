declare const brand: unique symbol;

export type Branded<T, Brand extends string> = T & { [brand]: Brand };

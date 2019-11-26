
const row = [...Array(9).keys()];
export const bottom = [...Array(81).keys()].map(i =>
    row
        .map(v => v + 2 * 9)
        .concat(row.map(v => v + 5 * 9))
        .includes(i)
);
export const top = [...Array(81).keys()].map(i =>
    row
        .map(v => v + 3 * 9)
        .concat(row.map(v => v + 6 * 9))
        .includes(i)
);
const col = row.map(v => 9 * v);
export const right = [...Array(81).keys()].map(i =>
    col
        .map(v => v + 2)
        .concat(col.map(v => v + 5))
        .includes(i)
);
export const left = [...Array(81).keys()].map(i =>
    col
        .map(v => v + 3)
        .concat(col.map(v => v + 6))
        .includes(i)
);

import sudoku = require("sudoku");

export function handler(_event, context, callback) {
  const { identity, user } = context.clientContext;
  const puzzle = sudoku.makepuzzle();
  callback(null, {
    statusCode: 200,
    // body: JSON.stringify(puzzle)
    body: JSON.stringify(context)
  });
}

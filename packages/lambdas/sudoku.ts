import sudoku = require("sudoku");
import { APIGatewayEvent, Context, Callback } from "aws-lambda";

export function handler(
  event: APIGatewayEvent,
  context: Context,
  callback: Callback
) {
  if (event.httpMethod === "POST") {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(sudoku.solvepuzzle(JSON.parse(event.body!)))
    });
  } else {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(sudoku.makepuzzle())
    });
  }
}

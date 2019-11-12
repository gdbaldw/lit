import { makepuzzle } from "../web_modules/sudoku.js";

const url = "/.netlify/functions/sudoku";

export async function getpuzzle(): Promise<(number | null)[]> {
  return new Promise((resolve, reject) => resolve(makepuzzle()));
  // return fetch(url).then(data => data.json());
}

export async function getsolution(
  puzzle: (number | null)[]
): Promise<(number | null)[]> {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(puzzle)
  }).then(data => data.json());
}

const url = "/.netlify/functions/sudoku";

export async function getpuzzle() {
  return fetch(url).then(data => data.json());
}

export async function getsolution(puzzle: (number | null)[]) {
  const data = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(puzzle)
  });
  return await data.json();
}

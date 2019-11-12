import {
  html,
  css,
  LitElement,
  customElement,
  property
} from "../web_modules/lit-element.js";

import { makepuzzle, solvepuzzle } from "../web_modules/sudoku.js";

// Input element constant attributes, used for styling
const row = [...Array(9).keys()];
const bottom = [...Array(91).keys()].map(i =>
  row
    .map(v => v + 2 * 9)
    .concat(row.map(v => v + 5 * 9))
    .includes(i)
);
const top = [...Array(91).keys()].map(i =>
  row
    .map(v => v + 3 * 9)
    .concat(row.map(v => v + 6 * 9))
    .includes(i)
);
const col = row.map(v => 9 * v);
const right = [...Array(91).keys()].map(i =>
  col
    .map(v => v + 2)
    .concat(col.map(v => v + 5))
    .includes(i)
);
const left = [...Array(91).keys()].map(i =>
  col
    .map(v => v + 3)
    .concat(col.map(v => v + 6))
    .includes(i)
);

@customElement("sudoku-board")
export default class extends LitElement {
  @property({ type: Array })
  puzzle: (number | null)[] = [];

  @property({ type: Array })
  work: (number | null)[] = [];

  @property({ type: Array })
  incorrect: boolean[] = [];

  @property({ type: Array })
  solution: (number | null)[] = [];

  get inputs() {
    return this.shadowRoot!.querySelectorAll("input");
  }

  newpuzzle() {
    this.puzzle = makepuzzle();
    this.solution = solvepuzzle(this.puzzle)!;
    this.work = [...this.puzzle];
    if (this.inputs.length == 81) {
      this.work.forEach((cv, i) => {
        this.inputs[i].value = cv === null ? "" : "" + (1 + cv);
      });
    }
    this.incorrect = Array(81).fill(false);
  }

  firstUpdated() {
    this.newpuzzle();
  }

  async checksolution() {
    this.incorrect = this.solution.map((cv, i) => cv !== this.work[i]);
    if (this.incorrect.every(v => !v)) this.puzzle = this.work;
  }

  solve() {
    this.work = [...this.solution];
    this.work.forEach((cv, i) => {
      this.inputs[i].value = "" + (1 + cv!);
    });
    this.incorrect = Array(81).fill(false);
  }

  input(i: number) {
    return (event: InputEvent) => {
      let data = event.data!;
      if ("1" <= data && data <= "9") {
        this.inputs[i].value = data;
        this.work[i] = parseInt(data) - 1;
      } else {
        const value = this.inputs[i].value;
        if (value.length === 2) {
          this.inputs[i].value = value[0];
        } else {
          this.inputs[i].value = "";
          this.work[i] = null;
        }
      }
      if (this.incorrect[i]) {
        this.incorrect[i] = false;
        this.incorrect = [...this.incorrect];
      }
    };
  }

  render() {
    return html`
      <h1>Sudoku</h1>
      <section>
        ${this.work.map(
          (cv: any, i: number) =>
            html`
              <input
                value=${cv === null ? "" : cv + 1}
                ?readonly=${this.puzzle[i] !== null}
                ?incorrect=${this.incorrect[i]}
                @input=${this.input(i)}
                ?bottom=${bottom[i]}
                ?top=${top[i]}
                ?left=${left[i]}
                ?right=${right[i]}
              />
            `
        )}
      </section>
      <button @click=${this.newpuzzle}>New Puzzle</button>
      <button @click=${this.checksolution}>Check Solution</button>
      <button @click=${this.solve}>Solve</button>
    `;
  }

  static get styles() {
    return css`
      :host {
        display: block;
        font-family: sans-serif;
        text-align: center;
      }

      section {
        width: 27rem;
        margin: auto;
        display: grid;
        grid-template-columns: repeat(9, 3rem);
        grid-template-rows: repeat(9, 3rem);
        border: 5px solid black;
        border-radius: 5px;
        margin-bottom: 1rem;
      }

      input {
        font-size: 2rem;
        text-align: center;
        border: 1px solid lightskyblue;
      }

      input[bottom] {
        border-bottom-color: black;
      }

      input[top] {
        border-top-color: black;
      }

      input[left] {
        border-left-color: black;
      }

      input[right] {
        border-right-color: black;
      }

      input[incorrect] {
        background-color: pink;
      }

      input[readonly] {
        background-color: lightgray;
      }
    `;
  }
}

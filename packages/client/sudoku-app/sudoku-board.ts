import {
  html,
  css,
  LitElement,
  customElement,
  property
} from "../web_modules/lit-element.js";

import { getpuzzle, getsolution } from "./sudoku-fetch.js";

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

  async makepuzzle() {
    this.puzzle = await getpuzzle();
    this.solution = await getsolution(this.puzzle);
    this.work = [...this.puzzle];
    this.work.forEach((cv, i) => {
      this.inputs[i].value = cv === null ? "" : "" + (1 + cv);
    });
    this.incorrect = Array(81).fill(false);
  }

  firstUpdated() {
    this.makepuzzle();
  }

  async checksolution() {
    this.incorrect = this.solution.map((cv, i) => cv !== this.work[i]);
    if (this.incorrect.every(v => !v)) this.puzzle = this.work;
  }

  solvepuzzle() {
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
              />
            `
        )}
      </section>
      <button @click=${this.makepuzzle}>New Puzzle</button>
      <button @click=${this.checksolution}>Check Solution</button>
      <button @click=${this.solvepuzzle}>Solve</button>
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
        border: solid;
        margin-bottom: 1rem;
      }

      input {
        font-size: 2rem;
        text-align: center;
      }

      input[incorrect] {
        background-color: red;
      }
    `;
  }
}

class Sudoku{
	constructor(n){
		this.numeros = ['1','2','3','4','5','6','7','8','9'];
		this.matriz = Array(81).fill(' ');
		this.linhas = [0,0,0,0,0,0,0,0,0];
		this.colunas = [0,0,0,0,0,0,0,0,0];
		this.blocos = [0,0,0,0,0,0,0,0,0];
		this.numbers = [0,0,0,0,0,0,0,0,0];

		this.generate();

		this.solution = [...this.matriz]; // solution of the sudoku

		this.remove_clues(n);

		this.answer = [...this.matriz]; // user answer

		this.jogo = document.getElementById("sudoku");

		this.erros = 0;
		this.show_erro = false;
		this.selected = -1;
		this.print();
		this.start_time = Date.now();
	}

	print(){
		this.jogo.replaceChildren();
		const blocos = [];
		for(let i = 0; i < 9; i++){
			blocos.push(document.createElement("div"));
			blocos[i].classList.add("bloco");
			this.jogo.appendChild(blocos[i]);
		}
		const clues = [];
		for(let i = 0; i < 9; i++) this.numbers[i] = 0;
		for(let i = 0; i < 81; i++){
			const clue = document.createElement("button");
			clues.push(clue);
			const { l, c, b } = this.pos_values(i);
			clue.textContent = this.answer[i];

			this.numbers[parseInt(this.answer[i]) - 1]++;

			clue.onclick = () => {
				console.log(i);
				this.selected = i;
				this.print();
			};
			blocos[b].appendChild(clue);
			if( i == this.selected){
				clues[this.selected].classList.add("selected");
			} else{
				if(this.show_erro
				&& this.answer[i] != ' '
				&& this.answer[i] != this.solution[i]){
					clues[i].classList.add("errado");
				}
				const sel_values = this.pos_values(this.selected);
				if(l == sel_values.l
				|| c == sel_values.c
				|| b == sel_values.b){
					clues[i].classList.add("highlight");
				}
				if(this.answer[i] == this.answer[this.selected]
				&& this.answer[i] != ' '){
					clues[i].classList.add("highlight");
				}
			}
		}
	}

	shuffle(arr){
		for(let i = arr.length - 1; i > 0; i--){
			const j = Math.floor(Math.random() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
	}

	next_empty(){
		for(let i = 0; i < 81; i++)
			if(this.matriz[i] == ' ')
				return i;
		return -1;
	}

	pos_values(pos){
		let l = Math.floor(pos / 9);
		let c = Math.floor(pos % 9);
		let b = Math.floor(l / 3) * 3 +  Math.floor(c / 3);
		let mask = ~( this.linhas[l]
					| this.colunas[c]
					| this.blocos[b] )
					& ((1<<9) - 1);
		return {l, c, b, mask};
	}

	verify(first){
		let pos = this.next_empty();
		if(pos == -1) return 1;

		let {l, c, b, mask} = this.pos_values(pos);

		let cnt = 0;
		while( mask ){
			let bit = mask & -mask;
			mask -= bit;
			let d = 31 - Math.clz32(bit);

			this.matriz[pos] = String(d + 1);
			this.linhas[l] ^= bit;
			this.colunas[c] ^= bit;
			this.blocos[b] ^= bit;

			cnt += this.verify(first);

			this.matriz[pos] = ' ';
			this.linhas[l] ^= bit;
			this.colunas[c] ^= bit;
			this.blocos[b] ^= bit;

			if( cnt > 1 ) return cnt;
			if( first && cnt > 0) return 1;
		}

		return cnt;
	}

	generate(){
		let pos = this.next_empty();
		if( pos == -1) return true;

		let {l, c, b, mask} = this.pos_values(pos);

		let bits = [];
		while(mask){
			let bit = mask & -mask;
			mask -= bit;
			bits.push(bit);
		}

		this.shuffle(bits);

		for(const bit of bits){
			let d = 31 - Math.clz32(bit);

			this.matriz[pos] = String(d + 1);
			this.linhas[l] ^= bit;
			this.colunas[c] ^= bit;
			this.blocos[b] ^= bit;

			if(this.generate())
				return true;

			this.matriz[pos] = ' ';
			this.linhas[l] ^= bit;
			this.colunas[c] ^= bit;
			this.blocos[b] ^= bit;
		};
		return false;
	}

	remove_clues(n){
		let pos = [];
		for(let i = 0; i < 81; i++)
			pos.push(i);

		this.shuffle(pos);

		let removed = 0;

		for(const p of pos){
			if( 81 - removed == n ) break;
			let old = this.matriz[p];

			let {l, c, b} = this.pos_values(p);
			let d = parseInt(this.matriz[p]) - 1;

			this.matriz[p] = ' ';
			this.linhas[l] ^= ( 1 << d );
			this.colunas[c] ^= ( 1 << d );
			this.blocos[b] ^= ( 1 << d );

			if(this.verify(0) == 1) removed++;
			else{
				this.matriz[p] = old;
				this.linhas[l] ^= ( 1 << d );
				this.colunas[c] ^= ( 1 << d );
				this.blocos[b] ^= ( 1 << d );
			}
		};
	}
}

let dificuldade = "facil";
const dificuldades = [
	{ nome: "facil", clues: 50 },
	{ nome: "medio", clues: 40 },
	{ nome: "dificil", clues: 30 },
	{ nome: "muito dificil", clues: 24 }
];

let sudoku;
const botoes = document.getElementById("botoes");
const opcoes = ['1','2','3','4','5','6','7','8','9','del'];
const resultados = document.getElementById("resultados");

const header_botoes = document.getElementById("right");
const header_nomes = ['show_error'];
let show_erro = false;

function setup_header(){
	for(let i = 0; i < header_nomes.length; i++){
		console.log(header_nomes[i]);
		const botao = document.createElement("button");
		botao.innerText = header_nomes[i];
		botao.setAttribute("onclick",header_nomes[i] + "()");
		header_botoes.appendChild(botao);
	}
}

function show_error(){
	show_erro = !show_erro;
	sudoku.show_erro = show_erro;
	sudoku.print();
}

function start_game(){
	const d = dificuldades.filter( (d) => {
		return d.nome == dificuldade;
	})[0];
	sudoku = new Sudoku(d.clues);
	resultados.replaceChildren();
	sudoku.jogo.classList.remove("naovisivel");
	botoes.classList.remove("naovisivel");
	options_buttons();
}

function difficult_buttons(){
	for(let i = 0; i < dificuldades.length; i++){
		const botao = document.createElement("button");
		botao.textContent = dificuldades[i].nome;
		botao.onclick = () => { dificuldade = dificuldades[i].nome; };
		document.getElementById("dificuldades").appendChild(botao);
	};
	const restart = document.createElement("button");
	restart.textContent = "Restart";
	restart.onclick = () => start_game();
	document.getElementById("dificuldades").appendChild(restart);
}

function end_game(){
	sudoku.jogo.classList.add("naovisivel");
	botoes.classList.add("naovisivel");

	const titulo = document.createElement("h2");
	titulo.textContent = "Você Venceu!";

	const tempo = document.createElement("div");

	const now = Date.now();
	let solve_time = now - sudoku.start_time;
	const horas = Math.floor(solve_time / (60 * 60 * 1000)).toString().padStart(2,'0');
	solve_time = solve_time % (60 * 60 * 1000);
	const minutos = Math.floor(solve_time / (60 * 1000)).toString().padStart(2,'0');
	solve_time = solve_time % (60 * 1000);
	const segundos = Math.floor(solve_time / 1000).toString().padStart(2,'0');

	tempo.textContent = `Tempo: ${horas}:${minutos}:${segundos}`

	const erros = document.createElement("div");
	erros.textContent = `Erros: ${sudoku.erros}`;

	const retry = document.createElement("button");
	retry.textContent = "Jogar Novamente";
	retry.onclick = () => start_game()

	resultados.appendChild(titulo);
	resultados.appendChild(tempo);
	resultados.appendChild(erros);
	resultados.appendChild(retry);
}

function options_buttons(){
	botoes.replaceChildren();
	for(let i = 0; i < opcoes.length; i++){
		const botao = document.createElement("button");
		botao.textContent = opcoes[i];
		if(opcoes[i] != 'del'
		&& sudoku.numbers[parseInt(opcoes[i]) - 1] == 9)
			continue;
		botao.onclick = () => {
			console.log(opcoes[i]);
			console.log(sudoku);
			sudoku.change = true;
			if(sudoku.selected == -1 || sudoku.matriz[sudoku.selected] != ' '){
				console.log("return");
				return;
			}
			if(opcoes[i] == 'del') sudoku.answer[sudoku.selected] = ' ';
			else sudoku.answer[sudoku.selected] = opcoes[i];

			if(sudoku.answer[sudoku.selected] != ' '
			&& sudoku.answer[sudoku.selected] != sudoku.solution[sudoku.selected])
				sudoku.erros++;

			sudoku.print();
			options_buttons();

			for(let i = 0; i < 81; i++){ // Verifica se ta tudo certo, e retona se não estiver
				if( sudoku.answer[i] != sudoku.solution[i] )
					return;
			}

			console.log("voce venceu");

			end_game();
		};
		botoes.appendChild(botao);
	}
}

difficult_buttons();
start_game();
setup_header();

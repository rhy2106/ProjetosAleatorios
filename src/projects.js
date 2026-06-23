const projetos = document.getElementById("projetos");
const projects = ['vim','sudoku','typing'];
const project_files = {
	'vim':'vim.html',
	'sudoku':'sudoku.html',
	'typing':'typing.html'
}
const images = {
	'vim':'../imagens/vim.png',
	'sudoku':'../imagens/sudoku.png',
	'typing':'../imagens/sudoku.png'
}

for(let i = 0; i < projects.length; i++){
	const button = document.createElement("a");
	button.href = project_files[projects[i]];

	const item = document.createElement("div");
	item.classList.add("item");

	const imagem = document.createElement("img");
	imagem.src = images[projects[i]];

	const texto = document.createElement("div");
	texto.textContent = projects[i];

	projetos.appendChild(button);
	button.appendChild(item);
	item.appendChild(imagem);
	item.appendChild(texto);
}


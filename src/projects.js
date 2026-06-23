const projetos = document.getElementById("projetos");
const projects = ['vim','sudoku','typing'];
const project_files = {
	'vim':'/ProjetosAleatorios/views/vim.html',
	'sudoku':'/ProjetosAleatorios/views/sudoku.html',
	'typing':'/ProjetosAleatorios/views/typing.html'
}
const images = {
	'vim':'/ProjetosAleatorios/imagens/vim.png',
	'sudoku':'/ProjetosAleatorios/imagens/sudoku.png',
	'typing':'/ProjetosAleatorios/imagens/sudoku.png'
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


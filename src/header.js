// document.createElement();
// .appendChild();
// .classList();

const header = document.getElementById("header");
const categories = ['home'];
const header_files = {
	'home':'/index.html'
}

const left = document.createElement("div");
left.id = "left";
header.appendChild(left);

for(let i = 0; i < categories.length; i++){
	const button = document.createElement("a");
	button.href = header_files[categories[i]];
	button.textContent = categories[i];
	left.appendChild(button);
}

const titulo = document.getElementById("titulo");
header.appendChild(titulo);

const right = document.createElement("div");
right.id = "right";
header.appendChild(right);

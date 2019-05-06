{ // init graphics
	let canvas = document.createElement("canvas");
	let ctx = canvas.getContext("2d");

	canvas.width = document.body.clientWidth;
	canvas.height = document.body.clientHeight;

	document.body.appendChild(canvas);

	temp.graphics = {
		canvas,
		ctx,
	}
}

const graphics = {
	rectangle(x, y, w, h) {
		let ctx = temp.graphics.ctx;

		ctx.beginPath();
		ctx.rect(x, y, w, h);
	},

	fill(color) {
		let ctx = temp.graphics.ctx;

		ctx.fillStyle = color;
		ctx.fill();
	},
}

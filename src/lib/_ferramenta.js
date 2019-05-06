let temp = {}

if (main) {
	main();

	if (loop) {
		(function FERRAMENTA_LOOP() {
			requestAnimationFrame(FERRAMENTA_LOOP);

			loop();
		})();
	}
} else {
	throw new Error("No main() function");
}

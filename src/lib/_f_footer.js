if (typeof main == "function") {
	main();

	if (typeof loop == "function") {
		(function FERRAMENTA_LOOP() {
			requestAnimationFrame(FERRAMENTA_LOOP);

			loop();
		})();
	}
} else {
	throw new Error("No main() function");
}

function polling() {
  console.log("polling222!");
  setTimeout(polling, 1000 * 30);
}

polling();

function polling() {
  console.log("polling222!");
  setTimeout(polling, 1000 * 30);
}

polling();

const getBody = () => {
  const bodyElement = document.querySelector("body");
  console.log("bodyElement :", bodyElement);
};

getBody();

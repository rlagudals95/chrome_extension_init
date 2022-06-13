export const sendImage = () => {
  // Source: https://support.google.com/webmasters/answer/2598805?hl=en
  const imageUrlRegex =
    /(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*\.(?:bmp|gif|ico|jfif|jpe?g|png|svg|tiff?|webp))(?:\?([^#]*))?(?:#(.*))?/i;

  function extractImagesFromSelector(selector: string) {
    return unique(
      toArray(document.querySelectorAll(selector))
        .map(extractImageFromElement)
        .filter(isTruthy)
        .map(relativeUrlToAbsolute)
    );
  }

  function extractImageFromElement(element: any) {
    if (element.tagName.toLowerCase() === "img") {
      const src = element.src;
      const hashIndex = src.indexOf("#");
      return hashIndex >= 0 ? src.substr(0, hashIndex) : src;
    }

    if (element.tagName.toLowerCase() === "image") {
      const src = element.getAttribute("xlink:href");
      const hashIndex = src.indexOf("#");
      return hashIndex >= 0 ? src.substr(0, hashIndex) : src;
    }

    if (element.tagName.toLowerCase() === "a") {
      const href = element.href;
      if (isImageURL(href)) {
        return href;
      }
    }

    const backgroundImage = window.getComputedStyle(element).backgroundImage;
    if (backgroundImage) {
      const parsedURL = extractURLFromStyle(backgroundImage);
      if (isImageURL(parsedURL)) {
        return parsedURL;
      }
    }
  }

  function isImageURL(url: string) {
    return url.indexOf("data:image") === 0 || imageUrlRegex.test(url);
  }

  function extractURLFromStyle(style: string) {
    return style.replace(/^.*url\(["']?/, "").replace(/["']?\).*$/, "");
  }

  function relativeUrlToAbsolute(url: string) {
    return url.indexOf("/") === 0 ? `${window.location.origin}${url}` : url;
  }

  function unique(values:Array<any>) {
    return toArray(new Set(values));
  }

  function toArray(values:any) {
    return [...values];
  }

  function isTruthy(value:any) {
    return !!value;
  }

  chrome.runtime.sendMessage({
    type: "sendImages",
    allImages: extractImagesFromSelector("img, image, a, [class], [style]"),
    linkedImages: extractImagesFromSelector("a"),
    origin: window.location.origin,
  });
};

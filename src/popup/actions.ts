export const downloadImages = (imagesToDownload: any, options: any) => {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        { type: 'downloadImages', imagesToDownload, options },
        resolve
      );
    });
  };
  
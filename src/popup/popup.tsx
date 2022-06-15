import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import ReactDOM from "react-dom";
import { isIncludedIn, unique } from "../utils";
import { useRunAfterUpdate } from "../hooks/useRunAfterUpdate";
import * as actions from "./actions";
import { sendImage } from "./sendImage";
import { Images } from "./Images";

//import styled from "styled-components"
import "../styleSheets/main.css"

const initialOptions = localStorage;

const Popup = () => {
  const [count, setCount] = useState(0);
  const [currentURL, setCurrentURL] = useState<string>();
  const [options, setOptions] = useState(initialOptions);

  useEffect(() => {
    chrome.action.setBadgeText({ text: count.toString() });
  }, [count]);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      setCurrentURL(tabs[0].url);
    });
  }, []);

  const changeBackground = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0];
      if (tab.id) {
        chrome.tabs.sendMessage(
          tab.id,
          {
            color: "#555555",
          },
          (msg) => {
            console.log("result message:", msg);
          }
        );
      }
    });
  };

  // getImaeges
  const [allImages, setAllImages] = useState<any>([]);
  const [linkedImages, setLinkedImages] = useState<any>([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [visibleImages, setVisibleImages] = useState([]);

  useEffect(() => {
    const updatePopupData = (message: any) => {
      if (message.type !== "sendImages") return;

      setAllImages((allImages: any) =>
        unique([...allImages, ...message.allImages])
      );

      setLinkedImages((linkedImages: any) =>
        unique([...linkedImages, ...message.linkedImages])
      );

      localStorage.active_tab_origin = message.origin;
    };

    // Add images to state and trigger filtration.
    // `sendImages.js` is injected into all frames of the active tab, so this listener may be called multiple times.
    chrome.runtime.onMessage.addListener(updatePopupData);

    // Get images on the page
    chrome.windows.getCurrent((currentWindow) => {
      chrome.tabs.query(
        { active: true, windowId: currentWindow.id },
        (activeTabs: any) => {
          chrome.scripting.executeScript({
            target: { tabId: activeTabs[0].id },
            func: sendImage,
          });
        }
      );
    });

    return () => {
      chrome.runtime.onMessage.removeListener(updatePopupData);
    };
  }, [allImages]);

  //
  const imagesCacheRef = useRef<any>(); // Not displayed; only used for filtering by natural width / height
  const filterImages = useCallback(() => {
    let visibleImages =
      options.only_images_from_links === "true" ? linkedImages : allImages;

    let filterValue = options.filter_url;
    if (filterValue) {
      switch (options.filter_url_mode) {
        case "normal":
          const terms = filterValue.split(/\s+/);
          visibleImages = visibleImages.filter((url: string) => {
            for (let index = 0; index < terms.length; index++) {
              let term = terms[index];
              if (term.length !== 0) {
                const expected = term[0] !== "-";
                if (!expected) {
                  term = term.substr(1);
                  if (term.length === 0) {
                    continue;
                  }
                }
                const found = url.indexOf(term) !== -1;
                if (found !== expected) {
                  return false;
                }
              }
            }
            return true;
          });
          break;
        case "wildcard":
          filterValue = filterValue
            .replace(/([.^$[\]\\(){}|-])/g, "\\$1")
            .replace(/([?*+])/, ".$1");
        /* fall through */
        case "regex":
          visibleImages = visibleImages.filter((url: string) => {
            try {
              return url.match(filterValue);
            } catch (error) {
              return false;
            }
          });
          break;
      }
    }

    visibleImages = visibleImages.filter((url: string) => {
      const imageRefCurrent = imagesCacheRef?.current;
      const image = imageRefCurrent?.querySelector(
        `img[src="${encodeURI(url)}"]`
      );

      return (
        (options.filter_min_width_enabled !== "true" ||
          options.filter_min_width <= image.naturalWidth) &&
        (options.filter_max_width_enabled !== "true" ||
          image.naturalWidth <= options.filter_max_width) &&
        (options.filter_min_height_enabled !== "true" ||
          options.filter_min_height <= image.naturalHeight) &&
        (options.filter_max_height_enabled !== "true" ||
          image.naturalHeight <= options.filter_max_height)
      );
    });

    setVisibleImages(visibleImages);
  }, [allImages, linkedImages, options]);

  useEffect(filterImages, [allImages, linkedImages, options]);

  const [downloadIsInProgress, setDownloadIsInProgress] = useState(false);
  const imagesToDownload = useMemo(
    () => visibleImages.filter(isIncludedIn(selectedImages)),
    [visibleImages, selectedImages]
  );

  const [downloadConfirmationIsShown, setDownloadConfirmationIsShown] =
    useState(false);

  function maybeDownloadImages() {
    if (options.show_download_confirmation === "true") {
      setDownloadConfirmationIsShown(true);
    } else {
      downloadImages();
    }
  }

  async function downloadImages() {
    setDownloadIsInProgress(true);
    await actions.downloadImages(imagesToDownload, options);
    setDownloadIsInProgress(false);
  }

  const runAfterUpdate = useRunAfterUpdate();

  //
  return (
    <>
      {/* <style>{MainCss}</style> */}
      <ul style={{ minWidth: "600px", maxWidth: "800px" }}>
        {/* <li>Current URL: {allImages}sss</li>
        <li>Current Time: {new Date().toLocaleTimeString()}</li> */}
      </ul>
      {/* <button
        onClick={() => setCount(count + 1)}
        style={{ marginRight: "5px" }}
      >
        count up
      </button> */}

      {/* {visibleImages.map((url: string, index: number) => {
        return (
          <img
            key={index}
            src={url}
            style={{ width: "200px", height: "200px", objectFit: "cover" }}
          />
        );
      })} */}

      <Images
        options={options}
        visibleImages={visibleImages}
        selectedImages={selectedImages}
        imagesToDownload={imagesToDownload}
        setSelectedImages={setSelectedImages}
        style={undefined}
        checked={false}
      />
      {/* <button onClick={changeBackground}>change background</button> */}
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);

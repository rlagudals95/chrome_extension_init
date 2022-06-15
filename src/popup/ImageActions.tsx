import * as actions from "./actions";
import React from "react";

interface ButtonProps {
  imageUrl?: string;
  onClick?: Function;
  props?: any;
  options?: any;
  value?:string;
}

export const ImageUrlTextbox = ({
  imageUrl,
  onClick,
  value,
  ...props
}: ButtonProps) => {
  return (
    <>
      <input
        type="text"
        readOnly
        value={value}
        onClick={(e) => {
          e.currentTarget.select();
        }}
        {...props}
      />
    </>
  );
};

export const OpenImageButton = ({
  imageUrl,
  onClick,
  ...props
}: ButtonProps) => {
  return (
    <button
      type="button"
      title="Open in new tab"
      style={{ backgroundImage: `url("../images/open.svg")` }}
      onClick={(e) => {
        chrome.tabs.create({ url: imageUrl, active: false });
        if (onClick) {
          onClick(e);
        }
      }}
      {...props}
    />
  );
};

export const DownloadImageButton = ({
  imageUrl,
  options,
  onClick,
  ...props
}: ButtonProps) => {
  return (
    <button
      type="button"
      title="Download"
      style={{ backgroundImage: `url("/images/download.svg")` }}
      onClick={(e) => {
        actions.downloadImages([imageUrl], options);
        if (onClick) {
          onClick(e);
        }
      }}
      {...props}
    />
  );
};

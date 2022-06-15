// import html from "../html.js";
import React, { SetStateAction, useState } from "react";

interface StyleCustom {

}

interface IProps {
  children: React.ReactNode;
  className: string;
  indeterminate: any;
  style: any;
  title: string;
  checked: boolean;
  onChange: (e:React.MouseEvent) => void;
}

export const Checkbox = (props: IProps) => {
  const { children, className, indeterminate, style, title ,checked, onChange }: IProps = props;

  const setIndeterminate = (indeterminate: any) => (element: any):void => {
    if (element) {
      element.indeterminate = indeterminate;
    }
  };

  return (
    <label className={className} title={title}>
      <input
        ref={setIndeterminate(indeterminate)}
        type="checkbox"
        style={{ marginLeft: 0, ...style }}
        checked={checked}
        //onChange={onChange}
      />
      {children}
    </label>
  );
};

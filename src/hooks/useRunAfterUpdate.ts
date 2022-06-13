import { useLayoutEffect, useRef } from 'react';

export const useRunAfterUpdate = () => {
  const handlersRef = useRef<any>([]);

  useLayoutEffect(() => {
    handlersRef.current.forEach((handler:any) => handler());
    handlersRef.current = [];
  });

  return (handler:any) => {
    handlersRef.current.push(handler);
  };
};

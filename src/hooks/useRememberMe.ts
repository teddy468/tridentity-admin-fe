import { CheckboxChangeEvent } from "antd/lib/checkbox";
import React, { useEffect, useState } from "react";
import getStorage from "redux-persist/es/storage/getStorage";
import {
  getStorageRememberMe,
  setStorageRememberMe,
} from "src/helpers/storage";

const useRememberMe = () => {
  const [isRemember, setIsRemember] = useState<boolean>(false);
  function handleRemember(e: CheckboxChangeEvent) {
    setIsRemember(e.target.checked);
  }
  function rememberMe(): void {
    setStorageRememberMe(isRemember);
  }
  useEffect(() => {
    if (getStorageRememberMe()) {
      setIsRemember(true);
    } else {
      setIsRemember(false);
    }
  }, []);
  return { isRemember, handleRemember, rememberMe };
};

export default useRememberMe;

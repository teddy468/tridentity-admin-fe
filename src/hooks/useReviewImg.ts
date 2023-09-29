import React, { useState } from "react";

type IUseReviewImg = () => [
  number,
  boolean,
  (index: number) => void,
  () => void,
  React.Dispatch<React.SetStateAction<number>>
];
const useReviewImg: IUseReviewImg = () => {
  const [openModalPreview, setOpenModalPreview] = useState(false);
  const [current, setCurrent] = useState(0);

  function handleSelectImg(index: number) {
    setOpenModalPreview(true);
    setCurrent(index);
  }

  function handleOnClose() {
    setOpenModalPreview(false);
  }
  return [
    current,
    openModalPreview,
    handleSelectImg,
    handleOnClose,
    setCurrent,
  ];
};

export default useReviewImg;

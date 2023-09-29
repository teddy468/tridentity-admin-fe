import React from "react";

const useModal = () => {
  const [openModal, setOpenModal] = React.useState(false);

  function handleOpenModal() {
    setOpenModal(true);
  }

  function handleCloseModal() {
    setOpenModal(false);
  }

  return { openModal, handleOpenModal, handleCloseModal };
};

export default useModal;

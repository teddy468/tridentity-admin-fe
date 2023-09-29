import { useState } from "react";
import useModal from "./useModal";

const useAcceptOrReject = () => {
  const [selectedItem, setSelectedItem] = useState<any>();

  const {
    openModal: openModalReject,
    handleOpenModal: handleOpenModalReject,
    handleCloseModal: handleCloseModalReject,
  } = useModal();

  const {
    openModal: openModalAccept,
    handleOpenModal: handleOpenModalAccept,
    handleCloseModal: handleCloseModalAccept,
  } = useModal();

  function handleConfirmReject(item: any) {
    handleOpenModalReject();
    setSelectedItem(item);
  }

  function handleConfirmAccept(item: any) {
    handleOpenModalAccept();
    setSelectedItem(item);
  }

  return {
    openModalAccept,
    handleConfirmAccept,
    handleCloseModalAccept,
    openModalReject,
    handleConfirmReject,
    handleCloseModalReject,
    selectedItem,
  };
};

export default useAcceptOrReject;

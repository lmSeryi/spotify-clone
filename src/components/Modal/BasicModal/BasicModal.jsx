import React from "react";

import { Modal, Icon } from "semantic-ui-react";

import "./BasicModal.scss";

const BasicModal = ({ visible, setVisible, title, children }) => {
  const onClose = () => {
    setVisible(false);
  };

  return (
    <Modal open={visible} onClose={onClose} className="basic-modal" size="tiny">
      <Modal.Header>
        <h3>{title}</h3>
        <Icon name="close" onClick={onClose} />
      </Modal.Header>
      <Modal.Content>{children}</Modal.Content>
    </Modal>
  );
};

export default BasicModal;

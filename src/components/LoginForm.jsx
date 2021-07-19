import { Button, Modal } from "react-bootstrap";
import { useState, useEffect } from "react";

function LoginForm({ showModal, hideModal }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(showModal);
  }, [showModal]);
  const handleClose = () => {
    setShow(false);
    hideModal();
  };
  const handleShow = () => setShow(true);

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default LoginForm;

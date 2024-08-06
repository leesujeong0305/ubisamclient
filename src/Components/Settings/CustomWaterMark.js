import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import GetUserInfo from '../../API/GetUserInfo';
import { UpdateUserInfo } from '../../API/UpdateUserInfo';

import './CustomWaterMark.css'

const CustomWaterMark = ({isOpen}) => {
    const [show, setShow] = useState(false);
    const [customText, setCustomText] = useState('');

    const handleCustomChange = (e) => setCustomText(e.target.value);


    const handleShow = () => {
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
        //onClose();
    };

    const handleAdd = async () => {
        await UpdateUserInfo(customText);

        handleClose();
    };

    useEffect(() => {
        const loadGetCustom = async () => {
            const loadCustom = await GetUserInfo();
            if (loadCustom.custom !== null) {
                setCustomText(loadCustom.custom);
            } else {
                setCustomText('');
            }
            
            //console.log('loadCustom', loadCustom);
        }
        
        //setShow(show);
        if (show) {
            loadGetCustom();
        }
        
    }, [show])


    return (
        <>
            <Button
                className="custom-button"
                style={{ backgroundColor: 'gray', borderColor: '#6F6F6F', display: "flex" }}
                onClick={handleShow}
            >
                <i className="bi bi-journal d-flex fs-5 justify-content-center" aria-hidden="true" />
                <div className="separator"></div>
                <span className="button-text">워터마크</span>
                <div className="tooltip-text">워터마크</div>
            </Button>

            <Modal show={show} onHide={handleClose} centered size="md">
                <Modal.Header closeButton>
                    <Modal.Title style={{ color: "#7952B3", fontWeight: "bold" }}>
                        Custom WaterMark
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mt-2" >
                        <textarea
                            as="textarea"
                            rows={10}
                            placeholder="YYYY/MM/DD - "
                            value={customText || ""}
                            onChange={handleCustomChange}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleAdd}>
                        Add
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default CustomWaterMark

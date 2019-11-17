import React from "react";
import PropTypes from "prop-types";
// core components
import { withSwalInstance } from 'sweetalert2-react';
import swal from 'sweetalert2';

const SweetAlert = withSwalInstance(swal);

function SweetAlertPage({ ...props }) {

    const { title, type, text, show } = props;


    return (
        <SweetAlert
            show={show}
            type={type}
            title={title}
            text={text}
            cancelButtonColor='#d33'
            onConfirm={props.sweetAlertClose}
        />
    );
}

SweetAlertPage.propTypes = {
    title: PropTypes.string,
    type: PropTypes.string,
    text: PropTypes.string
};

export default SweetAlertPage;
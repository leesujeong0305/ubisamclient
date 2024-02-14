import React from 'react'

const Footer = () => {
    return (
        <footer>
            <div style={{
                minHeight: "75vh",
                display: 'flex',
                flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', fontSize:'1rem'
            }}>
                &copy; 2022 Ubisam. All Rights Reserved.    
            </div>
        </footer>
    );
};

export default Footer
import React from 'react';
import './PDFContainer.css';

const PDFContainer = ({ children }) => {
    return (
        <div id="report-container">
            <table className="pdf-table">
                {children}
            </table>
        </div>
    );
}

export default PDFContainer;

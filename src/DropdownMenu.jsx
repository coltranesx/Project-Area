// src/DropdownMenu.jsx

import React, { useState, useEffect, useRef } from 'react';

function DropdownMenu({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Dışarı tıklandığında menüyü kapatmak için
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <button 
        className="dropdown-button" 
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
      </button>
      
      {isOpen && (
        <div className="dropdown-content">
          {React.Children.map(children, (child) =>
            React.cloneElement(child, {
              onClick: () => {
                if (child.props.onClick) {
                  child.props.onClick();
                }
                setIsOpen(false);
              },
              className: `${child.props.className || ''} dropdown-item`
            })
          )}
        </div>
      )}
    </div>
  );
}

export default DropdownMenu;
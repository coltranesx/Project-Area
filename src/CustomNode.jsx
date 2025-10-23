// src/CustomNode.jsx

import React, { useState } from 'react';
import { Handle, Position, NodeResizer } from 'reactflow';
import { useReactFlow } from 'reactflow';

// Desatüre ve koyu renk paleti
const colors = [
  '#4A5F8A', // Mavi
  '#427A6C', // Yeşil
  '#8F7A4A', // Sarı/Altın
  '#915B5B', // Kırmızı
  '#6A5C93'  // Mor
];

function CustomNode({ data, selected, id }) {
  const { setNodes } = useReactFlow();
  
  const [title, setTitle] = useState(data.title || 'Yeni Başlık');
  const [text, setText] = useState(data.label || 'Yeni Kutu');
  
  const cycleColor = () => {
    const currentColorIndex = colors.indexOf(data.color || colors[0]);
    const nextColor = colors[(currentColorIndex + 1) % colors.length];

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          node.data = {
            ...node.data,
            color: nextColor,
          };
        }
        return node;
      })
    );
  };

  const onTitleChange = (evt) => {
    const newTitle = evt.target.value;
    setTitle(newTitle);
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          node.data = { ...node.data, title: newTitle };
        }
        return node;
      })
    );
  };

  const onTextChange = (evt) => {
    const newText = evt.target.value;
    setText(newText);
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          node.data = { ...node.data, label: newText };
        }
        return node;
      })
    );
  };

  const nodeStyle = {
    backgroundColor: data.color || colors[0], 
    border: `2px solid ${selected ? '#fff' : 'transparent'}`,
    borderRadius: '8px',
    padding: '10px',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    transition: 'background-color 0.2s, border-color 0.2s',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  };

  const titleInputStyle = {
    background: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    width: 'calc(100% - 30px)',
    padding: '0',
  };

  const colorButtonStyle = {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: '2px solid white',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    padding: 0,
    flexShrink: 0,
  };

  const textareaStyle = {
    flexGrow: 1,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    borderRadius: '4px',
    color: 'white',
    padding: '5px',
    boxSizing: 'border-box',
    resize: 'none',
  };

  return (
    <>
      <NodeResizer 
        minWidth={150} 
        minHeight={100} 
        isVisible={selected}
      />
      
      <Handle 
        type="target" 
        position={Position.Left} 
        style={{ background: '#555' }} 
      />

      <div style={nodeStyle}>
        <div style={headerStyle}>
          <input
            type="text"
            value={title}
            onChange={onTitleChange}
            style={titleInputStyle}
            className="nodrag"
          />
          
          <button 
            title="Rengi Değiştir"
            style={colorButtonStyle} 
            onClick={cycleColor} 
          />
        </div>
        
        <textarea
          value={text}
          onChange={onTextChange}
          style={textareaStyle}
          className="nodrag"
        />
      </div>

      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#555' }}
      />
    </>
  );
}

export default CustomNode;
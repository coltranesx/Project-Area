// src/App.jsx

import React, { useState, useCallback, useMemo, useRef } from 'react';
import ReactFlow, {
  Controls, // Kontroller hala import ediliyor ama kullanılmıyor
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  ReactFlowProvider,
} from 'reactflow';

// CSS importları main.jsx dosyasındadır
import CustomNode from './CustomNode.jsx';
import DropdownMenu from './DropdownMenu.jsx';

// Bu anahtar, bozuk localStorage verisinin yüklenmesini engeller.
// Bu, projenin en güncel ve temiz halidir.
const LOCAL_STORAGE_KEY = 'proje-area-data-v5';

const initialNodes = [
  {
    id: '1',
    type: 'custom',
    position: { x: 50, y: 50 },
    data: { 
      title: 'Başlangıç Düğümü',
      label: 'Oyunun başlangıç noktası', 
      color: '#4A5F8A'
    },
    style: { width: 200, height: 120 },
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 350, y: 150 },
    data: { 
      title: 'İkinci Düğüm',
      label: 'Karakter seçimi',
      color: '#427A6C'
    },
    style: { width: 200, height: 120 },
  },
];

// Veri bütünlüğü için 'target' ID'sinin string ('2') olduğundan emin olun
const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
];

const getInitialState = () => {
  const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
  
  const defaults = { 
    projectName: 'Yeni Proje', 
    nodes: initialNodes, 
    edges: initialEdges 
  };

  if (savedData) {
    try {
      const parsedData = JSON.parse(savedData);
      
      if (!parsedData.nodes || !parsedData.edges || !parsedData.projectName) {
          console.warn("Hafızadaki veri eksik, varsayılana dönülüyor.");
          return defaults;
      }
      
      return { 
        projectName: parsedData.projectName,
        nodes: parsedData.nodes, 
        edges: parsedData.edges 
      };
    } catch (error) {
      console.error("Kayitli veri okunurken hata olustu, varsayılana dönülüyor:", error);
      return defaults;
    }
  }
  return defaults;
};

let idCounter = 3;
const getNewNodeId = () => `node_${idCounter++}`;

function Editor() {
  
  const initialState = getInitialState();
  const [nodes, setNodes] = useState(initialState.nodes);
  const [edges, setEdges] = useState(initialState.edges);
  const [projectName, setProjectName] = useState(initialState.projectName);
  
  const fileInputRef = useRef(null);
  
  const nodeTypes = useMemo(() => ({
    custom: CustomNode,
  }), []);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNode = useCallback(() => {
    const newNodeId = getNewNodeId();
    const newNode = {
      id: newNodeId,
      type: 'custom',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        title: 'Yeni Başlık',
        label: 'Yeni Kutu',
        color: '#8F7A4A',
      },
      style: { width: 200, height: 120 },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  const onSave = useCallback(() => {
    const dataToSave = {
      projectName: projectName,
      nodes: nodes,
      edges: edges,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
    alert('Proje önbelleğe kaydedildi!');
  }, [projectName, nodes, edges]);
  
  const onSaveAs = useCallback(() => {
    let fileName = prompt("Proje dosya adını girin:", projectName);
    
    if (!fileName) return;
    
    if (!fileName.endsWith('.json')) {
      fileName += '.json';
    }

    const dataToSave = {
      projectName: projectName,
      nodes: nodes,
      edges: edges,
    };
    
    const jsonString = JSON.stringify(dataToSave, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
  }, [projectName, nodes, edges]);

  const onFileOpen = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleFileOpen = useCallback((event) => {
    const file = event.target.files[0];
    if (!file || file.type !== 'application/json') {
      if(file) alert('Lütfen geçerli bir .json proje dosyası seçin.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const parsedData = JSON.parse(content);
        
        if (parsedData && parsedData.nodes && parsedData.edges && parsedData.projectName) {
          setProjectName(parsedData.projectName);
          setNodes(parsedData.nodes);
          setEdges(parsedData.edges);
          alert('Proje başarıyla yüklendi!');
        } else {
          alert('Dosya içeriği geçersiz. (projectName, nodes, edges bekleniyordu)');
        }
      } catch (error) {
        console.error("Dosya okunurken hata:", error);
        alert('Dosya okunurken bir hata oluştu.');
      }
    };
    reader.readAsText(file);
    event.target.value = null;
  }, [setNodes, setEdges, setProjectName]);

  const onReset = useCallback(() => {
    if (window.confirm('Emin misiniz? Mevcut çalışma sıfırlanacak ve varsayılan projeye dönülecek.')) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      // Hafızadan değil, temiz koddaki 'initial' verilerden yükle
      setProjectName('Yeni Proje'); // initialNodes içinde projectName yok, bu şekilde düzeltildi
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, [setNodes, setEdges, setProjectName]); // initialState bağımlılığı kaldırıldı

  const onDeleteSelected = useCallback(() => {
    setNodes((nds) => nds.filter((n) => !n.selected));
  }, [setNodes]);
  
  const handleProjectNameChange = (event) => {
    setProjectName(event.target.value);
  };

  return (
    <div className="artboard-container">
      
      <div className="menu-bar">
        <input 
          type="text"
          className="project-name-input"
          value={projectName}
          onChange={handleProjectNameChange}
        />
        
        <DropdownMenu title="Dosya">
          <button onClick={onFileOpen}>Dosyadan Aç (Open)</button>
          <button onClick={onSaveAs}>Dosyaya Kaydet (Save As)</button>
          <button onClick={onSave}>Hızlı Kaydet (Önbellek)</button>
          <button onClick={onReset}>Projeyi Sıfırla</button>
        </DropdownMenu>
        
        <DropdownMenu title="Düzenle">
          <button onClick={addNode}>Yeni Kutu Ekle</button>
          <button onClick={onDeleteSelected}>Seçili Kutuları Sil</button>
        </DropdownMenu>
      </div>
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        style={{ height: '100vh' }}
      >
        {/* React Flow kontrollerini geçici olarak kaldırdık. */}
        {/* <Controls /> */} 
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
      
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileOpen}
        accept="application/json"
      />
      
    </div>
  );
}

// Ana App bileşeni React Flow Provider'ı sarmalar
function App() {
  return (
    <ReactFlowProvider>
      <Editor />
    </ReactFlowProvider>
  );
}

export default App;
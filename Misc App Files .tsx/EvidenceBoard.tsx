

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, OnDragEndResponder } from '@hello-pangea/dnd';
import { BoardState, EvidenceItem } from '../types';

interface EvidenceBoardProps {
  board: BoardState;
  onDragEnd: OnDragEndResponder;
  onSaveEvidence: (evidenceData: Omit<EvidenceItem, 'id' | 'date'>, id?: string) => void;
  onDeleteEvidence: (evidenceId: string) => void;
  onRenameColumn: (columnId: string, newTitle: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onAddColumn: (title: string) => void;
}

const evidenceTypeIcons = {
  email: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-yellow-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <title>Email Icon</title>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  document: (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <title>Document Icon</title>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  statement: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <title>Statement Icon</title>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
   other: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <title>Other Evidence Icon</title>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
};

type ModalState = {
  isOpen: boolean;
  mode: 'add' | 'edit';
  evidence?: EvidenceItem;
};

const AddColumn: React.FC<{ onAdd: (title: string) => void }> = ({ onAdd }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title);
      setTitle('');
      setIsAdding(false);
    }
  };

  if (!isAdding) {
    return (
      <div className="w-full md:w-80 lg:w-96 flex-shrink-0">
        <button
          onClick={() => setIsAdding(true)}
          className="w-full p-3 bg-gray-200 dark:bg-gray-700/50 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition"
        >
          + Add another column
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 w-full md:w-80 lg:w-96 flex-shrink-0">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter column title..."
          className="w-full p-2 border border-blue-500 rounded-md bg-white dark:bg-gray-700 focus:outline-none"
          autoFocus
        />
        <div className="mt-2 flex items-center space-x-2">
          <button type="submit" className="px-4 py-1.5 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">Add Column</button>
          <button type="button" onClick={() => setIsAdding(false)} className="p-1.5 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </form>
    </div>
  );
};

const EvidenceBoard: React.FC<EvidenceBoardProps> = ({ board, onDragEnd, onSaveEvidence, onDeleteEvidence, onRenameColumn, onDeleteColumn, onAddColumn }) => {
  const [modal, setModal] = useState<ModalState>({ isOpen: false, mode: 'add' });
  const [formState, setFormState] = useState<Omit<EvidenceItem, 'id' | 'date'>>({ content: '', description: '', type: 'other' });
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [columnTitle, setColumnTitle] = useState('');

  const handleOpenModal = (mode: 'add' | 'edit', evidence?: EvidenceItem) => {
    setModal({ isOpen: true, mode, evidence });
    if (mode === 'edit' && evidence) {
      setFormState({ content: evidence.content, description: evidence.description, type: evidence.type });
    } else {
      setFormState({ content: '', description: '', type: 'other' });
    }
  };

  const handleCloseModal = () => {
    setModal({ isOpen: false, mode: 'add' });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.content) return;

    if (modal.mode === 'edit' && modal.evidence) {
      onSaveEvidence(formState, modal.evidence.id);
    } else {
      onSaveEvidence(formState);
    }
    handleCloseModal();
  };

  const handleStartRename = (columnId: string, currentTitle: string) => {
    setEditingColumnId(columnId);
    setColumnTitle(currentTitle);
  };

  const handleRenameSubmit = (columnId: string) => {
    if (columnTitle.trim()) {
      onRenameColumn(columnId, columnTitle);
    }
    setEditingColumnId(null);
    setColumnTitle('');
  };

  const handleColumnDelete = (columnId: string) => {
    if (window.confirm('Are you sure you want to delete this column? All evidence inside will be moved to the Uncategorized column.')) {
      onDeleteColumn(columnId);
    }
  };

  if (!board) {
    return <div>Loading evidence board...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Evidence Board</h3>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Drag evidence to allegations, or add new items to build your case.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal('add')}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
        >
          Add Evidence
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col md:flex-row overflow-x-auto space-y-4 md:space-y-0 md:space-x-4 items-start pb-4">
          {board.columnOrder.map(columnId => {
            const column = board.columns[columnId];
            const evidenceList = column.evidenceIds.map(evidenceId => board.evidence[evidenceId]).filter(Boolean); // Filter out undefined if evidence was deleted
            return (
              <div key={column.id} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 w-full md:w-80 lg:w-96 flex-shrink-0">
                <div className="group flex justify-between items-center p-2 mb-2">
                  {editingColumnId === column.id ? (
                    <input
                      type="text"
                      value={columnTitle}
                      onChange={(e) => setColumnTitle(e.target.value)}
                      onBlur={() => handleRenameSubmit(column.id)}
                      onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit(column.id)}
                      className="font-bold text-gray-800 dark:text-white bg-transparent border-b-2 border-blue-500 focus:outline-none flex-grow"
                      autoFocus
                    />
                  ) : (
                    <h4 className="font-bold text-gray-800 dark:text-white flex-grow">{column.title}</h4>
                  )}
                  {column.id !== 'uncategorized' && !editingColumnId && (
                    <div className="flex items-center space-x-1 flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleStartRename(column.id, column.title)}
                        className="p-1.5 rounded text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
                        aria-label="Rename column"
                      >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.232 5.232z" /></svg>
                      </button>
                      <button
                        onClick={() => handleColumnDelete(column.id)}
                        className="p-1.5 rounded text-gray-500 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-500"
                        aria-label="Delete column"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  )}
                </div>
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`min-h-[200px] p-2 rounded-md transition-colors ${snapshot.isDraggingOver ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-gray-200/50 dark:bg-gray-700/50'}`}
                    >
                      {evidenceList.map((evidence, index) => (
                        <Draggable key={evidence.id} draggableId={evidence.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`group relative p-3 mb-3 bg-white dark:bg-gray-900 rounded-md shadow-sm border-l-4 ${snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-500' : ''} border-blue-500`}
                              style={{ ...provided.draggableProps.style }}
                            >
                              <div className="flex items-start">
                                {evidenceTypeIcons[evidence.type]}
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900 dark:text-gray-200">{evidence.content}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{evidence.description}</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                        Updated: {new Date(evidence.date).toLocaleString()}
                                    </p>
                                </div>
                              </div>
                              <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleOpenModal('edit', evidence)} className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300" aria-label="Edit item">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.232 5.232z" /></svg>
                                </button>
                                <button onClick={() => onDeleteEvidence(evidence.id)} className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-red-500" aria-label="Delete item">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
          <AddColumn onAdd={onAddColumn} />
        </div>
      </DragDropContext>

      {modal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" aria-modal="true" role="dialog">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">{modal.mode === 'add' ? 'Add New Evidence' : 'Edit Evidence'}</h3>
            <form onSubmit={handleFormSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content / Title</label>
                  <input type="text" id="content" value={formState.content} onChange={e => setFormState({...formState, content: e.target.value})} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-gray-50 dark:bg-gray-700" required />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                  <textarea id="description" value={formState.description} onChange={e => setFormState({...formState, description: e.target.value})} rows={3} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-gray-50 dark:bg-gray-700"></textarea>
                </div>
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                  <select id="type" value={formState.type} onChange={e => setFormState({...formState, type: e.target.value as EvidenceItem['type']})} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-gray-50 dark:bg-gray-700">
                    <option value="email">Email</option>
                    <option value="document">Document</option>
                    <option value="statement">Statement</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvidenceBoard;
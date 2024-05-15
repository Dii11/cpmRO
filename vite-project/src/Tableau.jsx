import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { Delete } from '@mui/icons-material';

function TaskTable({ tasks, setTasks }) {
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    taskName: '',
    duration: ''
  });

  const handleRowClick = (index) => {
    setSelectedRowIndex(index === selectedRowIndex ? null : index);
  };

  const handleDoubleClick = (index) => {
    setSelectedRowIndex(index);
    setOpenDialog(true);
    setFormData({
      taskName: tasks[index].taskName,
      duration: tasks[index].duration
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDelete = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
    setSelectedRowIndex(null); 
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = () => {
    // Update task data with form data
    const updatedTasks = [...tasks];
    updatedTasks[selectedRowIndex] = {
      ...updatedTasks[selectedRowIndex],
      taskName: formData.taskName,
      duration: formData.duration
    };
    setTasks(updatedTasks);
    setOpenDialog(false);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom Tâche</TableCell>
              <TableCell>Durée</TableCell>
              <TableCell>Tâches Antérieures</TableCell>
              <TableCell>Tâches successeurs</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task, index) => (
              <TableRow 
                key={index} 
                onClick={() => handleRowClick(index)} 
                onDoubleClick={() => handleDoubleClick(index)} 
                selected={selectedRowIndex === index}
              >
                <TableCell>{task.taskName}</TableCell>
                <TableCell>{task.duration}</TableCell>
                <TableCell>{task.previousTasks.join(', ')}</TableCell>
                <TableCell>{task.successors.length > 0 ? task.successors.join(', ') : 'fin'}</TableCell>
                {selectedRowIndex === index && (
                  <TableCell>
                    <IconButton onClick={() => handleDelete(index)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Modifier la tâche</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nom Tâche"
            name="taskName"
            value={formData.taskName}
            onChange={handleFormChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            type="number"
            label="Durée"
            name="duration"
            value={formData.duration}
            onChange={handleFormChange}
            margin="normal"
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleFormSubmit}>Enregistrer</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default TaskTable;

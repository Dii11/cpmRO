import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Typography } from "@mui/material";
import Tableau from "./Tableau";
import {
  determineSuccessorTasks,
  determineSuccessorsOfDeb,
  determinePreviousTasksOfFin,
  calculerDatesAuPlusTotEtPlusTard,
} from "./Fonction";
  import Flow from "./Graphe";
 //import Flow from "./G";

import "./App.css";

function TaskForm() {
  const [formData, setFormData] = useState({
    taskName: "",
    duration: "",
    previousTasks: [],
  });

  const [tasks, setTasks] = useState([]);

  const [showFlow, setShowFlow] = useState(false);

  const [graphe, setGraphe] = useState([]);
  const [bout, setbout] = useState("résoudre");

  const [titre, settitre] = useState("Tâches");
  const handleChange = (event) => {
    const { name, value } = event.target;
    const newValue = name === "previousTasks" ? value.split(",") : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newTask = { ...formData };

    const successorTasks = determineSuccessorTasks([...tasks, formData]);

    const tasksWithSuccessors = tasks.map((task) => ({
      ...task,
      successors: successorTasks[task.taskName] || [],
    }));

    setTasks([
      ...tasksWithSuccessors,
      { ...newTask, successors: successorTasks[newTask.taskName] || [] },
    ]);

    setFormData({ taskName: "", duration: "", previousTasks: [] });
  };

  const handleResolve = () => {
    const succDeb = determineSuccessorsOfDeb(tasks);
    const prevFin = determinePreviousTasksOfFin(tasks);

    const debTask = {
      taskName: "deb",
      duration: 0,
      previousTasks: [],
      successors: succDeb,
    };
    const finTask = {
      taskName: "fin",
      duration: 0,
      previousTasks: prevFin,
      successors: [],
    };
    const updatedTasks = [debTask, ...tasks.concat(finTask)];
    const ta = calculerDatesAuPlusTotEtPlusTard(updatedTasks);
    setGraphe(ta);
    setShowFlow(true);
    settitre("Ordonnancement des tâches Critical Path Method");
    const bouton = document.querySelector(".bout");
    bouton.style.backgroundColor = "green";
    const b = (bouton.textContent = "modifier");
    setbout(b);
  };

  const modifier = () => {
    setShowFlow(false);
    settitre("Tâches");
    const bouton = document.querySelector(".bout");
    const b = (bouton.textContent = "résoudre");

    bouton.style.backgroundColor = "blue";
    setbout(b);
  };

  const vider=()=>setTasks([])
  return (
    <Container>
      <div className="content">
        <div className="entete">
          <Typography variant="h4" color="secondary">
            {titre}
          </Typography>
          <div className="bouton">
            <Button variant="contained" 
            className='bout'
            color="primary" onClick={

              bout=='modifier' ? modifier : handleResolve
            }>{bout}
            </Button>

         
          </div>
        </div>

        {showFlow ? (
          <Flow tasks={graphe} />
         // <Flow/>
        ) : (
          <div className="dataContent">
            <div className="formulaire">
              <Typography variant="h6" color="initial">
                Ajouter des tâches
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Nom Tâche"
                  name="taskName"
                  value={formData.taskName}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  required
                />
                <TextField
                  fullWidth
                  type="number"
                  label="Durée"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Tâches antérieures (séparées par des virgules)"
                  name="previousTasks"
                  value={formData.previousTasks.join(",")}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  required
                />
                <Button type="submit" variant="contained" color="primary">
                  Ajouter
                </Button>
              </form>
            </div>
            <Tableau tasks={tasks} setTasks={setTasks} vider={vider} />
          </div>
        )}
      </div>
    </Container>
  );
}

export default TaskForm;

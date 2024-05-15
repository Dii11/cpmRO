import React, { useState, useEffect } from "react";
import { Container, TextField, Button } from "@mui/material";
import Tableau from "./Tableau";
import {
  determineSuccessorTasks,
  ordonnancerTaches,
  createSuccessorLinks,
  generateInitialNodes,
  calculerDatesAuPlusTot,
  determineSuccessorsOfDeb,
  determinePreviousTasksOfFin,
  calculerDatesAuPlusTard,
  determineCheminCritique,
} from "./Fonction";
import Flow from "./Graphe";
import Cercle from "./Cercle";

function TaskForm() {
  const [formData, setFormData] = useState({
    taskName: "",
    duration: "",
    previousTasks: [],
  });

  const [tasks, setTasks] = useState([]);
  const [alltasks, setallTasks] = useState([]);

  const [tachedetails, setTachedetails] = useState([]);
  const [showFlow, setShowFlow] = useState(false);

  const [graphe, setGraphe] = useState([]);
  const [noeuds, setNoeuds] = useState([]);

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
  
    const updatedTasks = tasks.concat( finTask);
    setallTasks(updatedTasks);
  
    // Mettre à jour les tâches seulement après les avoir ajoutées
    const ta = calculerDatesAuPlusTot(updatedTasks);
    const tr = calculerDatesAuPlusTard(ta);
    const chemin = determineCheminCritique(tr);
  
    // Mettre à jour le graphe et les nœuds après les calculs
    setGraphe(createSuccessorLinks(ta));
    setNoeuds(generateInitialNodes(ta));
  
    setShowFlow(true);
  
    const o = ordonnancerTaches(updatedTasks);
    setTachedetails(tr);
    console.log(graphe)
  };
  
  


  return (
    <Container>
      <div className="content">
        <div className="dataContent">
          <div className="formulaire">
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
          <Tableau tasks={tasks} setTasks={setTasks} />
          <Button variant="outlined" color="primary" onClick={handleResolve}>
            Résoudre
          </Button>
        </div>

        {showFlow && <Flow initialEdges={graphe} initialNodes={noeuds} />}
         {/* <div className="graphe">
        {showFlow ? (
          <div>
            {tachedetails.map((t, index) => (
              <div key={index}>
                <Cercle taches={t} />
              </div>
            ))}
          </div>
        ) : (
          <div>hello</div>
        )}
        </div>  */}
      </div>
    </Container>
  );
}

export default TaskForm;

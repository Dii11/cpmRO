//taches successeur
export function determineSuccessorTasks(tasks) {
  const successorTasks = {};

  // Initialise les listes des tâches successeurs pour chaque tâche
  tasks.forEach((task) => {
    successorTasks[task.taskName] = [];
  });

  // Parcourt chaque tâche pour trouver les successeurs
  tasks.forEach((task) => {
    task.previousTasks.forEach((previousTask) => {
      // Si la tâche précédente est trouvée dans une autre tâche, alors la tâche actuelle est un successeur
      if (successorTasks.hasOwnProperty(previousTask)) {
        successorTasks[previousTask].push(task.taskName);
      }
    });
  });

  // Ajoute "fin" comme successeur pour les tâches qui n'ont pas de successeurs
  tasks.forEach((task) => {
    if (successorTasks[task.taskName].length === 0) {
      successorTasks[task.taskName] = ["fin"];
    }
  });

  return successorTasks;
}

//tache successeur de deb
export function determineSuccessorsOfDeb(tasks) {
  const successorsOfDeb = [];

  // Parcourt chaque tâche pour trouver les successeurs de 'deb'
  tasks.forEach((task) => {
    if (task.previousTasks.includes("deb")) {
      successorsOfDeb.push(task.taskName);
    }
  });

  return successorsOfDeb;
}

//tache antérieur de fin
export function determinePreviousTasksOfFin(tasks) {
  const previousTasksOfFin = [];

  // Parcours de toutes les tâches pour trouver celles dont les successeurs incluent 'fin'
  tasks.forEach((task) => {
    if (task.successors.includes("fin")) {
      previousTasksOfFin.push(task.taskName); // Ajout de la tâche actuelle comme précédente de 'fin'
    }
  });

  return previousTasksOfFin;
}

export function calculerDatesAuPlusTotEtPlusTard(tasks) {
  const mergedDates = [];

  // Calcul des dates au plus tôt
  tasks.forEach((task) => {
    const prevTasksDuration = task.previousTasks.reduce((acc, prevTaskName) => {
      const prevTask = tasks.find((t) => t.taskName === prevTaskName);
      if (!prevTask) {
        console.error(
          `La tâche "${prevTaskName}" n'a pas été trouvée dans le tableau tasks.`
        );
        return acc;
      }
      const prevTaskDetails = mergedDates.find(
        (t) => t.taskName === prevTaskName
      );
      return Math.max(
        acc,
        prevTaskDetails ? prevTaskDetails.dateFinPlusTot : 0
      );
    }, 0);

    const duration = parseInt(task.duration);
    const dateDebutPlusTot = prevTasksDuration;
    const dateFinPlusTot = dateDebutPlusTot + duration;

    mergedDates.push({
      ...task,
      dateDebutPlusTot,
      dateFinPlusTot,
      datePlustard: [], // Initialiser le tableau pour les dates au plus tard
    });
  });

  // Calcul des dates au plus tard en partant de la fin
  const reversedTasks = [...mergedDates].reverse();
  reversedTasks.forEach((task) => {
    if (task.successors.length === 0) {
      task.datePlustard.push({
        date: task.dateFinPlusTot,
        taskName: task.taskName,
      });
    } else {
      task.successors.forEach((successorName) => {
        const successorTask = mergedDates.find(
          (t) => t.taskName === successorName
        );
        if (!successorTask) {
          console.error(
            `La tâche "${successorName}" n'a pas été trouvée dans le tableau tasks.`
          );
          return;
        }
        const successorStartTimes = successorTask.datePlustard.map(
          (dateObj) => ({
            date: dateObj.date - parseInt(successorTask.duration),
            taskName: successorTask.taskName,
          })
        );
        const minSuccessorStartTime = successorStartTimes.reduce((min, curr) =>
          curr.date < min.date ? curr : min
        );
        task.datePlustard.push(minSuccessorStartTime);
      });
    }
  });

  return mergedDates;
}

//chemin critique
export function determineCheminCritique(tasks) {
  const cheminCritique = [];

  // Parcourez chaque tâche
  tasks.forEach((task) => {
    const minDatePlustard = Math.min(
      ...task.datePlustard.map((dateObj) => dateObj.date)
    );
    if (task.dateFinPlusTot === minDatePlustard) {
      // Si c'est le cas, ajoutez la tâche au chemin critique
      cheminCritique.push(task.taskName);
    }
  });

  return cheminCritique;
}

export const generateNodesAndEdges = (tasks) => {
  const nodes = [];
  const edges = [];
  const taskMap = {};

  // Charger les données actuelles des nœuds depuis le localStorage
  const recentNodeData =
    JSON.parse(localStorage.getItem("nodePositions")) || {};

  tasks.forEach((task) => {
    const nodeId = `node-${task.dateDebutPlusTot}`;
    const taskLabel = `${task.dateDebutPlusTot} (${task.taskName})`;
    const position = recentNodeData[nodeId] || {
      x: task.dateDebutPlusTot * 100,
      y: 100,
    };

    if (!taskMap[task.dateDebutPlusTot]) {
      nodes.push({
        id: nodeId,
        data: { label: taskLabel, taskName: task.taskName, task },
        position: position,
        style: { borderRadius: "50%" },
      });
      taskMap[task.dateDebutPlusTot] = nodeId;
    }

    task.successors.forEach((successor) => {
      const successorTask = tasks.find((t) => t.taskName === successor);
      const successorNodeId = `node-${successorTask.dateDebutPlusTot}`;
      const successorPosition = recentNodeData[successorNodeId] || {
        x: 100,
        y: 100,
      };

      if (!taskMap[successorTask.dateDebutPlusTot]) {
        nodes.push({
          id: successorNodeId,
          data: {
            label: (
              <div className="cercle">
                <div className="dateplustot">
                  {successorTask.dateDebutPlusTot}
                </div>
                <div className="ligne">.</div>
                <div className="dateplustard">
                  {task.datePlustard.map((date, index) => (
                    <div className="chaque_dateplustard" key={index}>
                      {date.taskName !== "fin" ? <> {date.date}</> :<>
                        {date.taskName}
                      </>}
                    </div>
                  ))}
                </div>
              </div>
            ),
            taskName: successorTask.taskName,
            task: successorTask,
          },
          position: successorPosition,
          style: { borderRadius: "50%" },
          sourcePosition: "right",
          targetPosition: "left",
        });
        taskMap[successorTask.dateDebutPlusTot] = successorNodeId;
      }

      edges.push({
        id: `edge-${task.taskName}-${successor}`,
        source: nodeId,
        target: successorNodeId,
        label: `${task.taskName} (${task.duration})`,
        style: { strokeWidth: 2 },
      });
    });
  });

  // Enregistrer les données actuelles des nœuds dans le localStorage
  const nodeData = nodes.reduce((acc, node) => {
    acc[node.id] = {
      taskName: node.data.taskName,
      x: node.position.x,
      y: node.position.y,
    };
    return acc;
  }, {});
  localStorage.setItem("nodeData", JSON.stringify(nodeData));

  return { nodes, edges };
};

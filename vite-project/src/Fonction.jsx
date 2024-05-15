
//taches successeur 
export function determineSuccessorTasks(tasks) {
  const successorTasks = {};
  
  // Initialise les listes des tâches successeurs pour chaque tâche
  tasks.forEach(task => {
      successorTasks[task.taskName] = [];
  });
  
  // Parcourt chaque tâche pour trouver les successeurs
  tasks.forEach(task => {
      task.previousTasks.forEach(previousTask => {
          // Si la tâche précédente est trouvée dans une autre tâche, alors la tâche actuelle est un successeur
          if (successorTasks.hasOwnProperty(previousTask)) {
              successorTasks[previousTask].push(task.taskName);
          }
      });
  });

  // Ajoute "fin" comme successeur pour les tâches qui n'ont pas de successeurs
  tasks.forEach(task => {
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
    tasks.forEach(task => {
        if (task.previousTasks.includes('deb')) {
            successorsOfDeb.push(task.taskName);
        }
    });

    return successorsOfDeb;
}

//tache antérieur de fin
export function determinePreviousTasksOfFin(tasks) {
  const previousTasksOfFin = [];

  // Parcours de toutes les tâches pour trouver celles dont les successeurs incluent 'fin'
  tasks.forEach(task => {
      if (task.successors.includes('fin')) {
          previousTasksOfFin.push(task.taskName); // Ajout de la tâche actuelle comme précédente de 'fin'
      }
  });

  return previousTasksOfFin;
}


  function getDateDebutPlusTotForTask(taskName, tasks) {
    const task = tasks.find(t => t.taskName === taskName);
    return task ? task.dateDebutPlusTot : null;
  }
  
  function getDatesDebutPlusTotForTargets(targets, tasks) {
    return targets.map(target => {
      if (typeof target === 'string') {
        return getDateDebutPlusTotForTask(target, tasks);
      } else {
        return target.map(t => getDateDebutPlusTotForTask(t, tasks));
      }
    });
  }
  //connection entre les taches  (flêche dans graphe)
  
  export function createSuccessorLinks(tasks) {
    const successorLinks = [];
    const initialNodes = generateInitialNodes(tasks);
  
    tasks.forEach((task, index) => {
      const sourceId = initialNodes[index].id;
      const targets = task.successors;
      const targetDatesDebutPlusTot = getDatesDebutPlusTotForTargets(targets, tasks);
  
      if (Array.isArray(targetDatesDebutPlusTot)) {
        targetDatesDebutPlusTot.forEach((dateDebutPlusTot, subIndex) => {
          const targetNode = initialNodes.find(node => parseInt(node.data.label) === dateDebutPlusTot);
          if (targetNode) {
            const targetId = targetNode.id;
            successorLinks.push({ id: `${index * tasks.length + subIndex}`, source: sourceId, target: targetId });
          }
        });
      } 
    });
  
    return successorLinks;
  }
  
  
//noeud des taches (cercle dans le graphe)

  export function generateInitialNodes(tasks) {
    const initialNodes = [];
  
    tasks.forEach((task, index) => {
      // Calculer les positions x et y en fonction de l'index
      const x = index * 100; // Ajustez selon votre besoin
      const y = index * 50; // Ajustez selon votre besoin
  
      const node = {
        id: `${index}`, // Utiliser l'index de la boucle comme ID de la tâche
        position: { x, y }, // Utiliser les positions calculées
        data: { label: `${task.dateDebutPlusTot}` },
      };
  
      initialNodes.push(node);
    });
  
    return initialNodes;
  }
  
//ordre chemin
export function ordonnancerTaches(taches) {
  let ordonnancementTaches = new Set();
  function trouverOrdonnancements(tache, ordonnancementCourant) {
      // Ajouter la tâche actuelle à l'ordonnancement courant
      ordonnancementCourant.push(tache.taskName);

      // Si la tâche a des successeurs
      if (tache.successors.length > 0) {
          // Pour chaque successeur de la tâche
          tache.successors.forEach(successeur => {
              // Trouver la tâche correspondante dans la liste des tâches
              let tacheSuivante = taches.find(t => t.taskName === successeur);
              if (tacheSuivante) {
                  // Récupérer les ordonnancements à partir de la tâche suivante
                  trouverOrdonnancements(tacheSuivante, [...ordonnancementCourant]);
              }
          });
      } else {
          // Si la tâche n'a pas de successeurs, ajouter l'ordonnancement courant à l'ensemble
          ordonnancementTaches.add(['deb', ...ordonnancementCourant]);
      }
  }

  let tachesDeb = taches.filter(tache => tache.previousTasks.includes('deb'));
  // Pour chaque tâche 'deb'
  tachesDeb.forEach(tacheDeb => {
      // Appeler la fonction récursive pour trouver les ordonnancements à partir de cette tâche 'deb'
      trouverOrdonnancements(tacheDeb, []);
  });

  // Convertir l'ensemble en tableau avant de le retourner
  return [...ordonnancementTaches];
}

//date au plus tot
export function calculerDatesAuPlusTot(tasks) {
  const mergedDates = [];

  tasks.forEach((task) => {
    const prevTasksDuration = task.previousTasks.reduce((acc, prevTaskName) => {
      const prevTask = tasks.find((t) => t.taskName === prevTaskName);
      if (!prevTask) {
        console.error(`La tâche "${prevTaskName}" n'a pas été trouvée dans le tableau tasks.`);
        return acc;
      }
      const prevTaskDetails = mergedDates.find((t) => t.taskName === prevTaskName);
      return Math.max(acc, prevTaskDetails ? prevTaskDetails.dateFinPlusTot : 0);
    }, 0);

    const duration = parseInt(task.duration);
    const dateDebutPlusTot = prevTasksDuration;
    const dateFinPlusTot = dateDebutPlusTot + duration;

    mergedDates.push({ 
      ...task, // Étendre avec toutes les informations de la tâche
      dateDebutPlusTot, 
      dateFinPlusTot 
    });
  });

  return mergedDates;
}

//date au plus tard
export function calculerDatesAuPlusTard(tasks) {
  // Rechercher la tâche "fin"
  const finTask = tasks.find(task => task.taskName === 'fin');

  // Initialiser la date au plus tard de la tâche "fin" à sa date de fin plus tot
  finTask.datePlustard = finTask.dateFinPlusTot;

  // Parcourir les tâches en ordre inverse pour calculer les dates au plus tard
  for (let i = tasks.length - 1; i >= 0; i--) {
    const task = tasks[i];

    // Calculer la date au plus tard de la tâche actuelle
    if (task.taskName !== 'fin') {
      const duration = parseInt(task.duration);
      const successors = task.successors;

      // Initialiser la date au plus tard à une valeur très grande
      let datePlustard = Number.MAX_SAFE_INTEGER;

      // Parcourir les successeurs pour trouver la date au plus tard minimale
      successors.forEach(successorName => {
        const successor = tasks.find(t => t.taskName === successorName);
        if (successor) {
          datePlustard = Math.min(datePlustard, successor.datePlustard - duration);
        }
      });

      // Mettre à jour la date au plus tard de la tâche actuelle
      task.datePlustard = datePlustard;
    }
  }

  return tasks;
}

//chemin critique
export function determineCheminCritique(tasks) {
  const cheminCritique = [];

  // Parcourez chaque tâche
  tasks.forEach(task => {
    // Vérifiez si la date de début au plus tard est égale à la date de fin au plus tard
    if (task.dateDebutPlusTot === task.datePlustard ) {
      // Si c'est le cas, ajoutez la tâche au chemin critique
      cheminCritique.push(task.taskName);
    }
  });

  return cheminCritique;
}




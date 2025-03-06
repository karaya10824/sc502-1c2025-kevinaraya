document.addEventListener('DOMContentLoaded', function(){

    const tasks = [{
        id: 1,
        title: "Complete project report",
        description: "Prepare and submit the project report",
        dueDate: "2024-12-01",
        comments: [{id: 1, comment: 'ff'}, {id:2, comment: 'f'}]
    },
    {
        id:2,
        title: "Team Meeting",
        description: "Get ready for the season",
        dueDate: "2024-12-01",
        comments:[{id : 1, comment: 'dd'}, {id : 2, comment: 'd'}]
    },
    {
        id: 3,
        title: "Code Review",
        description: "Check partners code",
        dueDate: "2024-12-01",
        comments: [{id: 1, comment: 'pp'}, {id:2, comment: 'p'}]
    }];
    
    function loadTasks(){
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';
        tasks.forEach(function(task){
            const taskCard = document.createElement('div');
            const commentCard = document.createElement('div');

            let comentarios = "";

            task.comments.forEach(function(comment, index){
                comentarios += `           
                    <div class="card mb-2">     
                        <p class="card-text">${comment.comment}</p>              
                        <button class="btn btn-danger btn-sm delete-comment" data-id="${task.id}" data-comment-index="${index}">Delete</button>  
                    </div>                  
                `;
            });

            taskCard.className = 'col-md-4 mb-3';
            taskCard.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${task.title}</h5>
                    <p class="card-text">${task.description}</p>
                    <p class="card-text"><small class="text-muted">Due: ${task.dueDate}</small> </p>
                </div>
                <div class="card-header">
                    <h5 class="card-title">Comentarios</h5>
                </div>

                <div class="card-body">
                    ${comentarios}                            
                </div>

                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-secondary btn-sm edit-task" data-id="${task.id}">Edit</button>
                    <button class="btn btn-secondary btn-sm comment-task" data-id="${task.id}">Comment</button>
                    <button class="btn btn-danger btn-sm delete-task" data-id="${task.id}">Delete</button>
                </div>
                <div class="card-body">
                    <input type="text" class="form-control mb-2" placeholder="Add a comment" id="comment-input-${task.id}">
                    <button class="btn btn-primary btn-sm add-comment" data-id="${task.id}">Add Comment</button>
                </div>
            </div>
            `;
            taskList.appendChild(taskCard);

        });

        document.querySelectorAll('.edit-task').forEach(function(button){
            button.addEventListener('click', handleEditTask);
        });

        document.querySelectorAll('.comment-task').forEach(function(button){
            button.addEventListener('click', handleCommentTask);
        });

        document.querySelectorAll('.delete-comment').forEach(function(button){
            button.addEventListener('click', handleDeleteComment);
        });

        document.querySelectorAll('.delete-task').forEach(function(button){
            button.addEventListener('click', handleDeleteTask);
        });

        document.querySelectorAll('.add-comment').forEach(function(button){
            button.addEventListener('click', handleAddComment);
        });
    }

    function handleEditTask(event){
        const taskId = parseInt(event.target.dataset.id);
        const task = tasks.find(t => t.id === taskId);

        if (task) {
            // Cargar datos en cada campo del formulario
            document.getElementById('task-id').value = task.id;
            document.getElementById('task-title').value = task.title;
            document.getElementById('task-desc').value = task.description;
            document.getElementById('due-date').value = task.dueDate;

            // Mostrar el modal
            currentTaskId = taskId;
            const modal = new bootstrap.Modal(document.getElementById('taskModal'));
            modal.show();
        }
    }

    function handleCommentTask(event){
        const taskId = parseInt(event.target.dataset.id);
        const task = tasks.find(t => t.id === taskId);

        if (task) {
            // Cargar datos en cada campo del formulario
            document.getElementById('task-id').value = task.id;

            // Mostrar el modal
            currentTaskId = taskId;
            const modal = new bootstrap.Modal(document.getElementById('commentModal'));
            modal.show();
        }
    }

    function handleDeleteComment(event){
        const taskId = parseInt(event.target.dataset.id);
        const commentIndex = parseInt(event.target.dataset.commentIndex);
        const task = tasks.find(t => t.id === taskId);

        // Eliminar el comentario del array y recargarlas
        if (task) {
            task.comments.splice(commentIndex, 1);
            loadTasks(); 
        }
    }

    function handleDeleteTask(event){
        const taskId = parseInt(event.target.dataset.id);
        const taskIndex = tasks.findIndex(t => t.id === taskId);

        // Eliminar la tarea del array y recargarlas
        if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1);
            loadTasks(); 
        }
    }

    function handleAddComment(event){
        const taskId = parseInt(event.target.dataset.id);
        const task = tasks.find(t => t.id === taskId);
        const commentInput = document.getElementById(`comment-input-${taskId}`);
        const commentText = commentInput.value;

        if (task && commentText) {
            task.comments.push({id: task.comments.length + 1, comment: commentText});
            commentInput.value = '';
            loadTasks();
        }
    }

    document.getElementById('task-form').addEventListener('submit', function(e){
        e.preventDefault();
        let currentTaskId = document.getElementById('task-id').value;
        const taskTitle = document.getElementById('task-title').value;
        const taskDesc = document.getElementById('task-desc').value;
        const dueDate = document.getElementById('due-date').value;

        if (currentTaskId) {
            // Editar tarea existente
            const taskIndex = tasks.findIndex(t => t.id === parseInt(currentTaskId));
            tasks[taskIndex] = {
                id: parseInt(currentTaskId),
                title: taskTitle,
                description: taskDesc,
                dueDate: dueDate
            };
        } else {
            // Agregar la tarea al array
            const newTask = {
                id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
                title: taskTitle,
                description: taskDesc,
                dueDate: dueDate
            };
            tasks.push(newTask);
        }

        document.getElementById('task-id').value = '';
        currentTaskId = null;
        e.target.reset();

        // Recargar las tareas
        loadTasks();

        const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
        modal.hide();
    });

    loadTasks();

});
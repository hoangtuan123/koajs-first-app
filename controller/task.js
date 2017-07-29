const Task = new require('../model/task');

exports.getTasks = async (ctx) => {
    const tasks = await Task.find({});
    if (!tasks)
        throw new Error("There was an error retrieving your tasks");
    else
        ctx.body = tasks;
}

exports.createTask = async (ctx) => {
    const taskOne = await Task.create({
        name: ctx.request.body.name,
        urgency: ctx.request.body.urgency
    })
    if (!taskOne) {
        throw new Error('Tasks failed to be created.');
    } else {
        ctx.body = { taskOne };
    }
}

exports.updateTask = async (ctx) => {
    const taskUpdate = await Task.update(
        { name: ctx.request.body.name },
        { urgency: ctx.request.body.urgency }
    );
    ctx.body = taskUpdate;
}
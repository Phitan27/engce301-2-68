const taskController = {
    // ✅ ถูกต้อง - อยู่ใน Controller
    async createTask(req, res, next) {
        const taskData = {
            title: req.body.title,
            description: req.body.description
        };
        const task = await taskService.createTask(taskData);
        res.status(201).json({ success: true, data: task });
    },

    // ❌ ผิด - Business logic อยู่ใน Controller
    async createTaskInvalid(req, res, next) {
    // ❌ การตรวจสอบเหล่านี้ควรอยู่ใน Service
    if (req.body.title.length < 3) {
        return res.status(400).json({ error: 'Title too short' });
    }
    if (req.body.priority === 'HIGH' && !req.body.description) {
        return res.status(400).json({ error: 'High priority needs description' });
    }
        // ...
        }
    };
    
    module.exports = taskController;
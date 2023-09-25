const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");

const app = express();
const port = 3000;

const { NlpManager } = require('node-nlp');

const manager = new NlpManager({ languages: ['en'] });

// Train the manager with some sample data
manager.addDocument('en', 'What are your prices?', 'prices');
manager.addDocument('en', 'How much do you charge?', 'prices');
manager.addDocument('en', 'Are cars available today?', 'availability');
manager.addDocument('en', 'Can I rent a car now?', 'availability');

manager.addAnswer('en', 'prices', 'Our prices start from $50/day.');
manager.addAnswer('en', 'availability', 'Yes, we have cars available today.');

(async () => {
    await manager.train();

    const app = express();
    const port = 3000;

    app.use(express.static('public'));
    app.use(bodyParser.json());

    app.post('/ask', async (req, res) => {
        const question = req.body.question;
        const response = await manager.process('en', question);
        
        res.json({ answer: response.answer || "Sorry, I can't answer that right now." });
    });

    app.listen(port, () => {
        console.log(
            `${new Date().toLocaleString()} - API Server Online - Worker PID: 
            ${process.pid} - ${port}`
        );
    });
})();


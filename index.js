const express = require('express');

const app = express();

const persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/info', (req, res) => {
    res.status(200).send(`<p>Phonebook has info of ${persons.length} people<p><p>${Date()}</p>`).end();
})

app.get('/api/persons', (req, res) => {
    if (persons && persons.length > 0) {
        return res.status(200).json(persons);
    } else {
        return res.status(404).json({ error: 'Not persons found' });
    }
})


const PORT = 3001;
app.listen(PORT, () => {
    console.log('Server listening on port', PORT);
})
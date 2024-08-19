const express = require('express');

const app = express();

let persons = [
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

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const person = persons.find(item => item.id === id);

    if (id && person) {
        res.status(200).json(person);
    } else {
        res.status(404).json({ error: 'Person not found' });
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    persons = persons.filter(item => item.id !== id);

    res.status(204).end();
})


const PORT = 3001;
app.listen(PORT, () => {
    console.log('Server listening on port', PORT);
})
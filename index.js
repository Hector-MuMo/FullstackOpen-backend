const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

morgan.token('log-post', (req) => {
    if (req.body) {
        return JSON.stringify(req.body);
    } else {
        return '-'
    }
})

app.use(cors());
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :log-post'));
app.use(express.static('dist'));

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

const RandomId = () => {
    return Math.floor(Math.random() * 10000).toString();
}

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

app.post('/api/persons', (req, res) => {
    const person = req.body;
    const isUnique = persons.find(item => item.name === person.name)

    if (!person?.name && !person?.number) {
        return res.status(400).json({
            error: 'name or number missing'
        })
    }

    if (isUnique) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const newPerson = {
        id: RandomId(),
        name: person.name,
        number: person.number
    };

    persons = [...persons, newPerson];

    return res.status(201).json(newPerson);
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const personDeleted = persons.find(item => item.id === id);
    persons = persons.filter(item => item.id !== id);

    console.log(personDeleted);
    res.status(200).send(personDeleted).end();
})


const PORT = 3001;
app.listen(PORT, () => {
    console.log('Server listening on port', PORT);
})
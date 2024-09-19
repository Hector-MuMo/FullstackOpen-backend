require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

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


app.get('/api/info', (req, res) => {
    Person.find({}).then(persons => {
        res.status(200).send(`<p>Phonebook has info of ${persons.length} people<p><p>${Date()}</p>`).end();
    }).catch(error => {
        console.log(error);
        res.status(400).json({ error: error.message })
    })
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        if (persons && persons.length > 0) {
            return res.status(200).json(persons);
        } else {
            return res.status(404).json({ error: 'Not persons found' });
        }
    }).catch(error => {
        console.log(error);
        res.status(400).json({ error: error.message })
    })

})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    Person.findById(id).then(person => {
        if (id && person) {
            res.status(200).json(person);
        } else {
            res.status(404).json({ error: 'Person not found' });
        }
    }).catch(error => next(error))

})

app.post('/api/persons', (req, res, next) => {
    const person = req.body;

    if (!person?.name && !person?.number) {
        return res.status(400).json({
            error: 'name or number missing'
        })
    }


    const newPerson = new Person({
        name: person.name,
        number: person.number
    });

    newPerson.save().then(savedPerson => {
        return res.status(201).json(savedPerson);
    }).catch(error => {
        next(error);
    })

})

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    Person.findByIdAndDelete(id).then(person => {
        console.log(person);
        res.status(204).json(person);
    })
        .catch(error => {
            next(error)
        })
});

app.put('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    const person = req.body;

    Person.schema.path('name').validate(function (value) {
        return value < 3
    }, 'The length of the name must have more than 2 characters')


    Person.findByIdAndUpdate(id, person, { runValidators: true }).then(person => {
        console.log(person);
        res.status(200).json(person);
    }).catch(error => {
        next(error);
    })
})

//Middleware
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message });
    }

    next(error)
}

app.use(errorHandler);


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log('Server listening on port', PORT);
})
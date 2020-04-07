const express = require('express');
const cors = require('cors');
const { uuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get('/repositories', (request, response) => {
  return response.status(200).json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;
  if (title && url && techs) {
    const newRepository = {
      id: uuid(),
      title: title,
      url: url,
      techs: techs,
      likes: 0,
    };
    repositories.push(newRepository);
    return response.status(201).json(newRepository);
  } else {
    return response.status(400).send();
  }
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const oldRepoIndex = repositories.findIndex((repo) => repo.id === id);
  if (oldRepoIndex < 0) {
    return response.status(400).json({
      error: 'Id not found.',
    });
  } else {
    const newRepo = {
      ...repositories[oldRepoIndex],
      title: title,
      url: url,
      techs: techs,
    };
    repositories[oldRepoIndex] = newRepo;
    return response.status(200).json(newRepo);
  }
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const deathRepoIndex = repositories.findIndex((repo) => repo.id === id);

  if (deathRepoIndex < 0) {
    return response.status(400).json({
      error: 'Id not found.',
    });
  } else {
    repositories.splice(deathRepoIndex, 1);
    return response.status(204).send();
  }
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;

  const lovedRepoIndex = repositories.findIndex((repo) => repo.id === id);

  if (lovedRepoIndex < 0) {
    return response.status(400).json({
      error: 'Id not found.',
    });
  } else {
    repositories[lovedRepoIndex].likes += 1;
    return response.status(200).json({
      likes: repositories[lovedRepoIndex].likes,
    });
  }
});

module.exports = app;

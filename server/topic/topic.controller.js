const dbContainer = require('../../database');
const queries = dbContainer.queries;

function addTopic(req, res) {
    const topic = req.body;
    return queries.TopicQueries.addTopic(topic).then(addedTopic => {
        return res.status(200).send();
    }).catch(err => {
        console.error(err);
        return res.status(500).send(err);
    });
}

function getTopicById(req, res) {
    const { id } = req.params;

    return queries.TopicQueries.getTopicById(id).then(topic => {
        return res.json(topic);
    }).catch(err => {
        console.error(err);
        return res.status(500).send(err);
    });
}

module.exports = {
    addTopic,
    getTopicById
}
const { db } = require('./db-container');
const _ = require('lodash');

function addTopic (topic) {
    const promiseObj = new Promise(function(resolve, reject) {
        const topicData = _.omit(topic, ['categories']);

        db('topic').insert(topicData, 'id').then(
            topicId => {
                const topicCategories = _.map(topic.categories, (categoryId) => {
                    return { category_id: categoryId, topic_id: _.head(topicId) };
                });
                return db.batchInsert('topic_categories', topicCategories, 30)
                    .then(() => {
                         resolve();
                    }).catch(reject);
            }
        ).catch(reject);
    });

    return promiseObj;
}

function getTopicById (id) {
    const promiseObj = new Promise(function(resolve, reject) {
        db('topic').where({ id }).then((topics) => {
            if (_.isEmpty(topics)) {
                resolve(null);
            } else {
                const topic = _.head(topics);
                return db('perspectives').where({ topic_id: id })
                    .then((perspectives) => {
                        topic.perspectives = perspectives;
                        return db('milestones').where({ topic_id: id })
                            .then((milestones) => {
                                topic.milestones = milestones;
                                return db('topic_details').where({ topic_id: id })
                                    .then((topic_details) => {
                                        topic.topic_details = topic_details;
                                        resolve(topic);
                                    }).catch(reject);
                            }).catch(reject);
                    }).catch(reject);
            }
            
        }).catch(reject);
    });

    return promiseObj;
}

module.exports = { addTopic, getTopicById };
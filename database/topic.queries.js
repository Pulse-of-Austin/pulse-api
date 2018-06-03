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

module.exports = { addTopic };
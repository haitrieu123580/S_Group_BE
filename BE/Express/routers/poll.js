const express = require("express")
const pollRouter = express.Router();
const knex = require('../database/connection')
const { verifyToken, verifyTokenAndAuthorization } = require('../middleware/verifyToken')
// create poll & option
pollRouter.post('/create-poll', [verifyToken], async (req, res) => {
  try {
    await knex.transaction(async (trx) => {
      const [pollId] = await trx('polls').insert({
        name: req.body.name,
        question: req.body.question,
        createdBy: req.user.id
      });
      const optionsWithPollId = req.body.options.map((option) => {
        return { ...option, pollId: pollId };
      });

      await trx('options').insert(optionsWithPollId);
    });
    return res.status(200).json({ message: 'created!' })
  } catch (error) {
    console.error('Đã xảy ra lỗi khi tạo hàng:', error);
  } finally {
    await knex.destroy();
  }

})
// update poll 
pollRouter.put('/update-poll/poll/:pollId', [verifyToken], async (req, res) => {
  const poll = {
    name: req.body.name,
    question: req.body.question
  }
  knex('polls')
    .where('id', req.params.pollId)
    .update(poll)
    .then((results) => {
      if (results) {
        return res.status(200).json({ message: 'update successed' })
      }
      else {
        return res.status(200).json({ message: 'poll not found' })
      }
    })
    .catch((err) => {
      return res.status(400).json({ message: 'something wrong!' })
    })

})
pollRouter.put('/update-poll/options/:optionId', async (req, res) => {
  const option = {
    title: req.body.title
  }
  knex('options')
    .where('id', req.params.optionId)
    .update(option)
    .then((result) => {
      if (result) {
        return res.status(200).json({ message: 'update successed' })
      }
      else {
        return res.status(400).json({ message: 'option not found' })
      }
    })
    .catch((err) => {
      return res.status.apply(400).json({ message: 'something wrong!' })
    })
})
//add-options
pollRouter.post('/update-poll/add-options/:pollId', [verifyToken], async (req, res) => {
  const optionsWithPollId = req.body.options.map((option) => {
    return { ...option, pollId: req.params.pollId };
  });
  knex('options')
    .insert(optionsWithPollId)
    .then((result) => {
      console.log(result);
      if (result) {
        return res.status(200).json('Option added')
      }
    })
})
//remove-option
pollRouter.delete('/update-poll/delete-option/:optionId', [verifyToken], async (req, res) => {
  knex('options')
    .where('id', req.params.optionId)
    .del()
    .then((result) => {
      // console.log(result);
      if (result) {
        return res.status(200).json({ message: 'deleted option' })
      }
      else {
        return res.json({ message: 'Something wrong when detele option' })
      }
    })
})
// delete 
pollRouter.delete('/delete-poll/:pollId', [verifyToken], async (req, res) => {
  if (req.user.isAdmin) {
    await knex('polls')
      .where('id', req.params.pollId)
      .del()
    return res.status(200).json({ message: 'delete successed' })
  }
  else {
    knex('polls')
      .where({ id: req.params.pollId, createdBy: req.user.id })
      .del()
      .then((deletedCount) => {
        if (deletedCount > 0) {
          return res.status(200).json({ message: 'Poll deleted successfully.' });
        } else {
          return res.status(200).json({ message: 'Poll not found for the provided poll ID and user ID.' });
        }
      })
      .catch((error) => {
        console.error('Error deleting poll:', error);
      })
  }
})
// read poll
pollRouter.get('/get-poll/:pollId', [verifyToken], async (req, res) => {
  knex('polls')
    .select('polls.name', 'polls.question', 'options.title as option_title', 'users.id as user_id', 'users.name as user_name')
    .leftJoin('options', 'polls.id', 'options.pollId')
    .leftJoin('options_users', 'options.id', 'options_users.optionId')
    .leftJoin('users', 'options_users.userId', 'users.id')
    .where('polls.id', req.params.pollId)
    .then((results) => {
      if (results.length !== 0) {
        const pollInfo = {
          name: results[0].name,
          question: results[0].question,
          options: [],
        };

        results.forEach((row) => {
          if (row.option_title) {
            pollInfo.options.push({
              title: row.option_title,
              users: row.user_id ? [{ id: row.user_id, name: row.user_name }] : [],
            });
          } else if (row.user_id) {
            const option = pollInfo.options[pollInfo.options.length - 1];
            option.users.push({ id: row.user_id, name: row.user_name });
          }
        });

        return res.json({ 'Poll Information': pollInfo });
      }
      else {
        return res.json({ message: 'Poll not found!' })
      }

    })
    .catch((error) => {
      console.error('Error retrieving poll information:', error);
    })
})
//submit-unsubmit
pollRouter.get('/submit-vote/:optionId', [verifyToken], async (req, res) => {
  // find exist submit
  knex('options_users')
    .select('*')
    .where({
      optionId: req.params.optionId,
      userId: req.user.id
    })
    .then((result) => {
      if (result.length == 0) {
        // insert new submit
        knex('options_users')
          .insert({
            optionId: req.params.optionId,
            userId: req.user.id
          })
          .then((result) => {
            if (result) {
              return res.status(200).json({ message: 'Submit Success' })
            }
            else {
              return res.json({ message: 'Something wrong when submit' })
            }
          })
      }
      else {
        // unsubmit
        knex('options_users')
          .where({
            optionId: req.params.optionId,
            userId: req.user.id
          })
          .del()
          .then((deletedRow) => {
            if (deletedRow > 0) {
              return res.status(200).json({ message: 'Unsubmit success' })
            }
            else {
              return res.json({ message: 'Something wrong when unsubmit' })
            }
          })
      }
    })
    .catch((err) => {
      return res.json({ message: 'Something wrong' })
    })

})
module.exports = pollRouter
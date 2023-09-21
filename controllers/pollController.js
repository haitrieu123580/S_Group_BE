const knex = require('../database/connection')
const Poll = require('../models/Poll.model')
const Option = require('../models/Option.model')
const OptionUser = require('../models/OptionUser.model')
const User = require('../models/User.model')
const sequelize = require('../database/sequelize')
const { Op } = require('sequelize')
// create poll & option
const createPoll = async (req, res) => {
  try {
    await sequelize.transaction(async (transaction) => {
      const poll = await Poll.create({
        name: req.body.name,
        question: req.body.question,
        createdBy: req.user.id
      }, { transaction });

      const options = req.body.options.map((option) => {
        return { ...option, pollId: poll.id };
      });

      await Option.bulkCreate(options, { transaction });
    });

    return res.status(200).json({ message: 'created!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'error when creating new poll' })
  } finally {
    await sequelize.close();
  }

}
// update poll 
updatePoll = async (req, res) => {
  const poll = {
    name: req.body.name,
    question: req.body.question
  }
  try {
    await Poll.update(
      poll,
      {
        where:
        {
          id: req.params.pollId
        }
      }
    );
    return res.status(200).json({ message: 'Updated poll' })

  } catch (error) {
    return res.json({ message: 'error when updating poll' })
  }
}
updateOption = async (req, res) => {
  const option = {
    title: req.body.title
  }
  try {
    const [numRowsUpdated, updatedOptions] = await Option.update(option, {
      where: { id: optionId },
      returning: true, 
    });

    if (numRowsUpdated > 0) {
      return res.status(200).json({ message: 'update succeeded', updatedOptions });
    } else {
      return res.status(400).json({ message: 'option not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'something wrong!' });
  }

}
//add-options
const addOption = async (req, res) => {
  const optionsWithPollId = req.body.options.map((option) => {
    return { ...option, pollId: req.params.pollId };
  });
  try {
    const result = await Option.bulkCreate(optionsWithPollId);

    if (result) {
      return res.status(200).json('Option added');
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong!' });
  }
}
//remove-option
const deleteOption = async (req, res) => {
  try {
    const result = await Option.destroy({
      where: { id: req.params.optionId },
    });

    if (result) {
      return res.status(200).json({ message: 'deleted option' });
    } else {
      return res.json({ message: 'Option not found' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong when delete option' });
  }
}
// delete 
const deletePoll = async (req, res) => {

  try {
    const result = await Option.destroy({
      where: { id: req.params.pollId },
    });

    if (result) {
      return res.status(200).json({ message: 'deleted poll' });
    } else {
      return res.json({ message: 'Poll not found' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong when delete poll' });
  }
}
// read poll
const getPoll = async (req, res) => {
  try {
    const results = await Poll.findAll({
      where: { id: req.params.pollId },
      attributes: ['name', 'question'],
      include: [
        {
          model: Option,
          attributes: ['title'],
          include: [
            {
              model: User,
              attributes: ['id', 'name'],
              through: { attributes: [] }, 
            },
          ],
        },
      ],
    });

    if (results.length !== 0) {
      const pollInfo = {
        name: results[0].name,
        question: results[0].question,
        options: results[0].options.map(option => {
          return {
            title: option.title,
            users: option.Users.map(user => ({ id: user.id, name: user.name })),
          };
        }),
      };

      return res.json({ 'Poll Information': pollInfo });
    } else {
      return res.json({ message: 'Poll not found!' });
    }
  } catch (error) {
    console.error('Error retrieving poll information:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
const submit = async (req, res) => {
  try {
    const optionId = parseInt(req.params.optionId);
    const userId = req.user.id;

    const [optionUser, created] = await OptionUser.findOrCreate({
      where: {
        optionId: optionId,
        userId: userId,
      },
      defaults: {
        optionId: optionId,
        userId: userId,
      },
    });

    if (created) {
      return res.status(200).json({ message: 'submitted successfully' });
    } else {
      return res.json({ message: 'You voted this option' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'error' });
  }
};


const unsubmit = async (req, res) => {
  try {
    const isExist = await OptionUser.findOne({
      where: {
        [Op.and]: [
          { optionId: req.params.optionId },
          { userId: req.user.id }
        ]
      }
    })
    if (isExist === null) {
      return res.json({ message: `you have not voted this option` })
    }
    else {
      await isExist.destroy();
      return res.json({ message: `Unsubmitted successfully` })
    }
  } catch (error) {
    return res.status(500).json({ message: 'error' })
  }
}
module.exports = {
  createPoll,
  updatePoll,
  getPoll,
  deleteOption,
  deletePoll,
  updateOption,
  addOption,
  submit,
  unsubmit,
}
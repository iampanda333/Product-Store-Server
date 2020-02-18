const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const db = require('../db/sql');
const middleware = require('../middleware/helper');
const comparePassword = require('../Utils/checkPassword');
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.json({ success: false, message: 'Please provide a username and a password.' });
  } else {
    db.sync().then(function () {
      var newUser = {
        username: req.body.username,
        password: req.body.password
      };

      return User.create(newUser).then(function () {
        res.status(201).json({ success: true, message: 'Account created!' });
      });
    }).catch(function (error) {
      console.log(error);
      res.status(403).json({ success: false, message: 'Username already exists!' });
    });
  }
});

router.post('/signin', async (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(404).json({ success: false, message: 'Username and password are needed!' });
  } else {
    var username = req.body.username,
      password = req.body.password;

    User.findAll({ limit: 1, where: { username: username } }).then(function (user) {
      if (!user) {
        res.status(404).json({ success: false, message: 'Authentication failed!' });
      } else {
        if (comparePassword(password, user[0].dataValues.password)) {
          var token = jwt.sign(
            { username: user[0].dataValues.username },
            process.env.Jwt_SECRET,
            { expiresIn: '30m' }
          );
          console.log(token);
          const updatedUser = {
            token
          };

          User.update(updatedUser,
            { where: { id: user[0].dataValues.id } }
          ).then(() => {
            res.json({ success: true, user: user[0].dataValues, token });
          });

        } else {
          res.status(404).json({ success: false, message: 'Login failed!' });
        }
      }
    }).catch(function (error) {
      res.status(500).json({ success: false, message: error });
    });
  }
})

router.get('/users', middleware.allowIfLoggedin, async (req, res) => {
  const user = res.locals.loggedInUser;
  if (user.isAdmin) {
    User.findAll({})
      .then(data => {
        res.send({ success: true, data });
      })
      .catch(err => {
        res.status(500).send({
          success: false,
          message: err.message || "Some error occurred while retrieving data."
        });
      });
  } else {
    res.status(401).send({ success: false, error: 'Unauthorized access' });
  }
})

router.get('/users/:id', middleware.allowIfLoggedin, async (req, res) => {
  const user = res.locals.loggedInUser;
  if (user.isAdmin) {
    const id = req.params.id;

    User.findById(id)
      .then(data => {
        res.send({ success: true, data });
      })
      .catch(err => {
        res.status(500).send({
          success: false,
          message: "Error while retrieving data"
        });
      });
  } else {
    res.status(401).send({ success: false, error: 'Unauthorized access' });
  }
})

router.put('/users/:id', middleware.allowIfLoggedin, async (req, res) => {
  const user = res.locals.loggedInUser;
  if (user.isAdmin) {
    const id = req.params.id;

    User.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            success: true,
            message: "Data was updated successfully."
          });
        } else {
          res.send({
            success: false,
            message: "Cannot update data"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          success: false,
          message: "Error while updating data"
        });
      });
  } else {
    res.status(401).send({ success: false, error: 'Unauthorized access' });
  }
})

router.delete('/users/:id', middleware.allowIfLoggedin, async (req, res) => {
  const user = res.locals.loggedInUser;
  if (user.isAdmin) {
    const id = req.params.id;

    User.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            success: true,
            message: "Data was deleted successfully!"
          });
        } else {
          res.send({
            success: false,
            message: "Cannot delete data"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Tutorial with id=" + id
        });
      });
  } else {
    res.status(401).send({ success: false, error: 'Unauthorized access' });
  }
})

module.exports = router;
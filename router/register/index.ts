import express from 'express';
import client from '../client';

const registerRouter = express.Router();

registerRouter.get('/', (req, res) => {
  res.render('register');
});

registerRouter.post('/', (req, res) => {
  const id = req.body.id;
  const password = req.body.password;
  const nickname = req.body.nickname;
  client.query('select id from user where id = ?', [id], (err, rows) => {
    if (rows) {
      res.json({'result': 'fail'})
    } else {
      client.query('insert into public.user(id, password, nickname) values ($1, $2, $3)', [id, password, nickname], (err, rows) => {
        if (err) throw err;
        console.log('ok');
        res.json({'result': 'ok'});
      })
    }
  })
})

export default registerRouter;


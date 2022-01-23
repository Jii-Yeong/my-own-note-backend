import express from 'express';
import client from '../client';

const loginRouter = express.Router();

loginRouter.post('/', (req, res) => {
  const id = req.body.id;
  const password = req.body.password;
  client.query('select * from public.user where id = $1', [id], (err, result) => {
    if (result.rows.length) {
      if (result.rows[0].id === id) {
        client.query('select * from public.user where password = $1', [password], (err, result) => {
          if (result && result.rows[0]) {
            res.json({'id': id, 'nickname': result.rows[0].nickname});
          }
        })
      }
    } else {
      res.json({'loginError': 'failed'});
    }
  })
})

export default loginRouter;


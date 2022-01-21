import express from 'express';
import client from '../client';

const loginRouter = express.Router();

loginRouter.post('/', (req, res) => {
  const id = req.body.id;
  const password = req.body.password;
  client.query('select * from public.user where id = $1', [id], (err, rows) => {
    if (rows) {
      if (rows.rows[0].id === id) {
        client.query('select * from public.user where password = $1', [password], (err, rows) => {
          if (rows) {
            res.json({'id': id});
          } else {
            res.json({'result': 'pwfalse'});
          }
        })
      }
    } else {
      res.json({'result': 'idfalse'});
    }
  })
})

export default loginRouter;


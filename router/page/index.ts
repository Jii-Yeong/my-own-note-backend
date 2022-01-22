import express from 'express';
import client from '../client';
const pageRouter = express.Router();

pageRouter.post('/select/all', (req, res) => {
  const userId = req.body.userId;
  client.query('select * from page where user_id = $1', [userId], (err, result) => {
    if (err) {
      throw err;
    }
    const page = result.rows.map(row => {
      return {
        parentPageId: row.parent_id,
        pageId: row.id,
        pageName: row.title,
      }
    })
    const pageList = {
      pages: page,
      count: page.length,
    }
    res.json(pageList);
  })
});

pageRouter.post('/insert', (req, res) => {
  const title = req.body.title;
  const userId = req.body.userId;
  const parrentId = req.body.parentId;
  client.query('INSERT INTO public.page(title, user_id, parent_id) VALUES ($1, $2, $3)', [title, userId, parrentId], (err, _) => {
    if (err) {
      res.json({ 'status': 'failed' });
      throw err;
    }
    res.json({ 'status': 'success' });
  })
});

pageRouter.post('/insert/content', (req, res) => {
  const text: string = req.body.text;
  const pageId = req.body.pageId;
  const index = req.body.index;
  client.query('select page_id from page_content where page_id = $1 and index = $2', [pageId, index], (err, result) => {
    if (result.rows.length) {
      client.query('update page_content set text = $1 where page_id = $2 and index = $3', [text, pageId, index], (err, _) => {
        if (err) {
          res.json({ 'status': 'failed' });
          throw err;
        }
        res.json({ 'status': 'success' });
      });
    } else {
      client.query('insert into public.page_content(page_id, text, index) VALUES ($1, $2, $3)', [pageId, text, index], (err, _) => {
        if (err) {
          res.json({ 'status': 'failed' });
          throw err;
        }
        res.json({ 'status': 'success' })
      })
    }
  })
});

pageRouter.post('/select/id', (req, res) => {
  const pageId = req.body.pageId;
  const title = req.body.title;
  client.query('select * from page_content where page_id = $1 order by index desc', [pageId], (err, result) => {
    if (err) throw err;
    if (result) {
      const textList = result.rows.map(row => {
        return {
          text: row.text,
          index: row.index,
        };
      })
      const pageContent = {
        title: title,
        text: textList,
        pageId: pageId,
      }
      res.json(pageContent);
    }
  })
})

pageRouter.delete('/delete/index', (req, res) => {
  const index = req.query.index;
  client.query('delete from page_content where index = $1', [index], (err, _) => {
    if (err) throw err;
    res.json({ 'status' : 'success' })
  })
})

export default pageRouter;
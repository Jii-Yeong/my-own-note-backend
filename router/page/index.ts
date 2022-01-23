import express from 'express';
import client from '../client';
import { STYLE_LIST } from '../types/paeg';
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
    });
    const pageList = {
      pages: page,
      count: page.length,
    }
    res.json(pageList);
  });
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
  });
});

pageRouter.post('/insert/content', (req, res) => {
  const textList: Array<any> = req.body.textList;
  const pageId = req.body.pageId;
  client.query('delete from page_content where page_id = $1', [pageId], (err, _) => {
    if (err) throw err;
    textList.forEach((text, index) => {
      client.query('insert into page_content(page_id, text, index, style) values ($1, $2, $3, $4)', [pageId, text.text, index, text.style], (err, _) => {
        if (err) throw err;
      });
    });
    res.json({ 'status' : 'success' });
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
          style: row.style,
        };
      });
      const pageContent = {
        title: title,
        text: textList,
        pageId: pageId,
      }
      res.json(pageContent);
    }
  });
})

pageRouter.delete('/delete', (req, res) => {
  const pageId = req.query.pageId;
  client.query('delete from page where id = $1', [pageId], (err, _) => {
    if (err) throw err;
    res.json({ 'status' : 'success' })
  });
})

export default pageRouter;
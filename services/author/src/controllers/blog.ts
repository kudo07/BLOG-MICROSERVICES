import { AuthenticatedRequest } from '../middlewares/isAuth.js';
import getBuffer from '../utils/dataUri.js';
import TryCatch from '../utils/TryCatch.js';
import cloudinary from 'cloudinary';
import { sql } from '../utils/db.js';
export const createBlog = TryCatch(async (req: AuthenticatedRequest, res) => {
  const { title, description, blogcontent, category } = req.body;
  const file = req.file;
  if (!file) {
    res.status(400).json({ message: 'No file to upload' });
    return;
  }
  const fileBuffer = getBuffer(file);
  if (!fileBuffer || !fileBuffer.content) {
    res.status(400).json({
      message: 'Failed to gufferenerate b',
    });
    return;
  }
  const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
    folder: 'blogs',
  });
  const result =
    await sql`INSERT INTO blogs (title, description, image, blogcontent,category, author) VALUES (${title}, ${description},${cloud.secure_url},${blogcontent},${category},${req.user?._id}) RETURNING *`;
  res.json({
    message: 'Blog created',
    blog: result[0],
  });
});

export const updaeBlog = TryCatch(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { title, descriptions, blogcontent, category } = req.body;
  const file = req.file;
  const blog = await sql`SELECT * FROM WHERE id=${id}`;

  if (!blog.length) {
    res.status(404).json({
      messagage: 'No blog with this id',
    });
    return;
  }
  if (blog[0].author !== req.user?._id) {
    res.status(401).json({
      message: 'You are not the owner of this blog',
    });
    return;
  }
  let imageUrl = blog[0].image;
  if (file) {
    const fileBuffer = getBuffer(file);
    if (!fileBuffer || !fileBuffer.content) {
      res.status(400).json({
        message: 'failed to generate buffer',
      });
      return;
    }
    const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
      folder: 'blogs',
    });
    imageUrl = cloud.secure_url;
  }
  const updatedBlog = await sql`UPDATE blogs SET
  title=${title || blog[0].title},
  description=${title || blog[0].description},
  image=${imageUrl},
  blogcontent=${title || blog[0].blogcontent},
  category=${title || blog[0].category}
  WHERE id=${id}
  RETURNING *
  `;
  res.json({
    message: 'Blog Updated',
    blog: updatedBlog[0],
  });
});

export const deleteBlog = TryCatch(async (req: AuthenticatedRequest, res) => {
  const blog = await sql`SELECT * FROM blogs WHERE id = ${req.params.id}`;
  if (!blog.length) {
    res.status(404).json({
      message: 'No blog found with this id',
    });
    return;
  }
  if (blog[0].author !== req.user?._id) {
    res.status(401).json({
      message: 'You are not author of this blog',
    });
    //  [ { id: 123, title: "My Blog", author: "user123" } ]

    return;
  }
  await sql`DELETE FROM savedblogs WHERE blogid=${req.params.id}`;
  await sql`DELETE FROM comments WHERE blogid=${req.params.id}`;
  await sql`DELETE FROM blogs WHERE id=${req.params.id}`;
  res.json({
    message: 'BLOG DELETE',
  });
});

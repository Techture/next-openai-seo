import { Configuration, OpenAIApi } from 'openai';

export default async function handler(req, res) {
  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(config);

  const { topic, keywords } = req.body;

  // Post content
  const postContentResponse = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    temperature: 0,
    messages: [
      {
        role: 'system',
        content: 'You are a blog post generator',
      },
      {
        role: 'user',
        content: `Write a long and detailed SEO-friendly blog post about ${topic}, that targets the following comma-separated keywords: ${keywords}. The response should be formatted in SEO-friendly HTML, limited to the following HTML tags: h1, h2, h3, h4, h5, h6, strong, li, ol, ul i`,
      },
    ],
  });

  const postContent =
    postContentResponse.data.choices[0]?.message?.content || '';

  // Title
  const titleResponse = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    temperature: 0,
    messages: [
      {
        role: 'system',
        content: 'You are a blog post generator',
      },
      {
        role: 'user',
        content: `Write a long and detailed SEO-friendly blog post about ${topic}, that targets the following comma-separated keywords: ${keywords}. The response should be formatted in SEO-friendly HTML, limited to the following HTML tags: h1, h2, h3, h4, h5, h6, strong, li, ol, ul i`,
      },
      {
        role: 'assistant',
        content: postContent,
      },
      {
        role: 'user',
        content: `Generate appropriate title tag text for the above ${postContent}`,
      },
    ],
  });

  // Meta description
  const metaDescriptionResponse = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    temperature: 0,
    messages: [
      {
        role: 'system',
        content: 'You are a blog post generator',
      },
      {
        role: 'user',
        content: `Write a long and detailed SEO-friendly blog post about ${topic}, that targets the following comma-separated keywords: ${keywords}. The response should be formatted in SEO-friendly HTML, limited to the following HTML tags: h1, h2, h3, h4, h5, h6, strong, li, ol, ul i`,
      },
      {
        role: 'assistant',
        content: postContent,
      },
      {
        role: 'user',
        content: `Generate SEO-friendly meta description content for the above ${postContent}`,
      },
    ],
  });

  const title = titleResponse.data.choices[0]?.message?.content || '';
  const metaDescription =
    metaDescriptionResponse.data.choices[0]?.message?.content || '';

  res.status(200).json({
    post: {
      postContent,
      title,
      metaDescription,
    },
  });
}

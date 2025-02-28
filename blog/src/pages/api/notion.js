import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export async function getAllPosts() {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
      filter: {
        property: 'Status',
        status: {
          equals: 'Publicado',
        },
      },
      sorts: [
        {
          property: 'Publicação', // Usando a propriedade 'Publicação' para ordenação
          direction: 'descending',
        },
      ],
    });
    console.log("RESULTADOS DA CONSULTA:", response.results);
    return response.results;
  } catch (error) {
    console.error('Erro ao buscar posts do Blog:', error);
    throw error;
  }
}

export async function getPostById(id) {
  try {
    console.log(`Buscando post com ID: ${id}`);
    const response = await notion.pages.retrieve({ page_id: id });
    console.log('Resposta da API do Notion:', response);

    const blocksResponse = await notion.blocks.children.list({
      block_id: id,
      page_size: 50,
    });

    return {
      ...response,
      blocks: blocksResponse.results,
    };
  } catch (error) {
    console.error('Erro ao buscar post por ID:', error);
    throw error;
  }
}

export async function getAdjacentPosts(id) {
  try {
    const allPosts = await getAllPosts();
    const currentIndex = allPosts.findIndex(post => post.id === id);

    if (currentIndex === -1) {
      throw new Error(`Post não encontrado: ${id}`);
    }

    const previousPost = allPosts[currentIndex + 1] || null;
    const nextPost = allPosts[currentIndex - 1] || null;

    return {
      previous: previousPost,
      next: nextPost,
    };
  } catch (error) {
    console.error('Erro ao buscar posts adjacentes:', error);
    throw error;
  }
}
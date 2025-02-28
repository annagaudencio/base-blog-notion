import Link from 'next/link';

import { getAllPosts } from './api/notion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Componente principal da página inicial do blog.
 * Exibe uma lista de posts obtidos do Notion.
 * @param {Array} posts - Lista de posts a serem exibidos.
 * @returns {JSX.Element} Componente da página inicial.
 */
export default function Home({ posts = [] }) {
  console.log("POSTS RECEBIDOS:", posts);

  // Verifica se a lista de posts é um array válido
  if (!Array.isArray(posts)) {
    return <p className="text-center text-gray-600">Nenhum post encontrado.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Título principal da página */}
      <h1 className="text-4xl font-bold mb-8">Meu Blog com Notion e Next.js</h1>
      
      {/* Lista de posts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Verifica se há posts a serem exibidos */}
        {posts.length === 0 ? (
          <p className="text-gray-600">Nenhum post encontrado.</p>
        ) : (
          posts.map((post) => {
            console.log("POST:", post);
            console.log("PROPRIEDADES DO POST:", post.properties);
            console.log("DATA BRUTA:", post.properties?.Publicação?.date?.start);

            let date = null;
            // Converte a data de publicação para um objeto Date
            if (post.properties?.Publicação?.date?.start) {
              try {
                date = new Date(post.properties.Publicação.date.start);
              } catch (error) {
                console.error('Erro ao converter a data:', error);
              }
            }

            // Limita o resumo a 200 caracteres
            const resumo = post.properties?.['Resumo do post']?.rich_text?.[0]?.plain_text || '';
            const resumoLimitado = resumo.length > 200 ? resumo.substring(0, 200) + '...' : resumo;

            return (
              <div key={post.id} className="rounded-lg border border-gray-200">
                {/* Imagem de capa do post */}
                {post.properties?.Capa?.files?.[0]?.file?.url && (
                  <img
                    src={post.properties.Capa.files[0].file.url}
                    alt={post.properties?.Title?.title?.[0]?.plain_text || 'Capa'}
                    className="rounded-lg mb-8"
                  />
                )}

                {/* Informações do post */}
                <div className="p-6">
                {/* Título do post com link para a página do post */}
                <h2 className="text-2xl font-semibold">
                  <Link href={`/posts/${post.id}`}>
                    {post.properties?.Title?.title?.[0]?.plain_text || 'Sem título'}
                  </Link>
                </h2>
                
                {/* Resumo do post */}
                <p className="text-gray-600 mt-2">
                  {resumoLimitado}
                </p>
                {/* Botão de "Leia mais" */}
                <Link href={`/posts/${post.id}`}>
                  <span className="text-blue-500 hover:underline mt-2 inline-block">Leia mais</span>
                </Link>
                {/* Informações adicionais do post: data de publicação e tags */}
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <span>
                    {date
                      ? format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR })
                      : 'Sem data'}
                  </span>
                  <span className="mx-2">•</span>
                  <span>
                    {post.properties?.Tags?.multi_select
                      ? post.properties.Tags.multi_select.map((tag) => tag.name).join(', ')
                      : 'Sem tags'}
                  </span>
                </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/**
 * Função para obter os dados estáticos da página.
 * Busca todos os posts do Notion e os passa como props para o componente Home.
 * @returns {Object} Props contendo a lista de posts.
 */
export async function getStaticProps() {
  const posts = await getAllPosts();
  console.log("POSTS RECEBIDOS NO getStaticProps:", posts);
  return {
    props: {
      posts,
    },
    revalidate: 60, // Revalidate a cada 60 segundos
  };
}
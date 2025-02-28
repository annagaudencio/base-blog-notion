import { getPostById, getAdjacentPosts } from '../api/notion';
import Link from 'next/link';

export default function PostPage({ post, adjacentPosts }) {
  if (!post) return <div>Post não encontrado</div>;

  const title = post.properties?.Title?.title?.[0]?.plain_text || 'Sem título';
  const coverUrl = post.properties?.Capa?.files?.[0]?.file?.url;
  const category = post.properties?.Categoria?.select?.name;
  const publicationDate = post.properties?.Publicação?.date?.start;
  const tags = post.properties?.Tags?.multi_select?.map(tag => tag.name).join(', ');
  const author = post.properties?.Autor?.people?.map(person => person.name).join(', ');
  const videoUrl = post.properties?.Video?.url;
  const embedUrl = videoUrl ? videoUrl.replace('youtu.be/', 'www.youtube.com/embed/').replace('watch?v=', 'embed/') : null;

  console.log('Post:', post);
  console.log('Adjacent Posts:', adjacentPosts);
  console.log('Title:', title);
  console.log('Cover URL:', coverUrl);
  console.log('Category:', category);
  console.log('Publication Date:', publicationDate);
  console.log('Tags:', tags);
  console.log('Author:', author);
  console.log('Video URL:', videoUrl);
  console.log('Embed URL:', embedUrl);

  return (
    <div className="container w-3/4 mx-auto my-8">
      {/* Capa do post */}
      {coverUrl && (
        <img
          src={coverUrl}
          alt={`Capa do post ${title}`}
          className="w-full h-64 object-cover rounded-lg mb-8"
        />
      )}
      
      {/* Video do post */}
      {embedUrl && typeof embedUrl === 'string' && (
        <div className="w-full h-[620px] mb-8">
          <iframe 
            src={embedUrl} 
            title="Vídeo do Canal" 
            frameBorder="0" 
            className="w-full h-full d rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerPolicy="strict-origin-when-cross-origin" 
            allowFullScreen
          >
          </iframe>
        </div>
      )}

      {/* info */}
      <div className="mb-8">
        <h1>{title}</h1>
        <p>Categoria: {category}</p>
        <p>Data de Publicação: {publicationDate}</p>
        <p>Tags: {tags}</p>
        <p>Autor: {author}</p>
      </div>

      {/* Conteúdo do post */}
      <div className="post-content">
        {post.blocks && post.blocks.length > 0 ? (
          post.blocks.map(block => (
            <div key={block.id}>
              {renderBlock(block)}
            </div>
          ))
        ) : (
          <p>Conteúdo do post não disponível.</p>
        )}
      </div>

      {/* Navegação entre posts */}
      <div className="mt-8 w-full flex justify-between">
        {adjacentPosts.previous && (
          <Link href={`/posts/${adjacentPosts.previous.id}`} legacyBehavior>
            <a className="previous-post">← {adjacentPosts.previous.properties?.Título?.title?.[0]?.plain_text || 'Post Anterior'}</a>
          </Link>
        )}
        {adjacentPosts.next && (
          <Link href={`/posts/${adjacentPosts.next.id}`} legacyBehavior>
            <a className="next-post">{adjacentPosts.next.properties?.Título?.title?.[0]?.plain_text || 'Próximo Post'} →</a>
          </Link>
        )}
      </div>
    </div>
  );
}

// Função para renderizar diferentes tipos de blocos do Notion
function renderBlock(block) {
  console.log('Renderizando bloco:', block);
  switch (block.type) {
    case 'paragraph':
      return <p>{block.paragraph.rich_text.map(text => text.plain_text).join('')}</p>;
    case 'heading_1':
      return <h1>{block.heading_1.rich_text.map(text => text.plain_text).join('')}</h1>;
    case 'heading_2':
      return <h2>{block.heading_2.rich_text.map(text => text.plain_text).join('')}</h2>;
    case 'heading_3':
      return <h3>{block.heading_3.rich_text.map(text => text.plain_text).join('')}</h3>;
    case 'bulleted_list_item':
      return <li>{block.bulleted_list_item.rich_text.map(text => text.plain_text).join('')}</li>;
    case 'image':
      return <img src={block.image.file.url} alt={block.image.caption ? block.image.caption.map(caption => caption.plain_text).join('') : ''} />;
    case 'code':
      return (
        <pre>
          <code>
            {block.code.rich_text.map(text => text.plain_text).join('')}
          </code>
        </pre>
      );
    default:
      return null;
  }
}

export async function getServerSideProps(context) {
  const { id } = context.params;
  try {
    const post = await getPostById(id);
    const adjacentPosts = await getAdjacentPosts(id);
    console.log('Post no getServerSideProps:', post);
    console.log('Adjacent Posts no getServerSideProps:', adjacentPosts);
    return {
      props: {
        post,
        adjacentPosts,
      },
    };
  } catch (error) {
    console.error('Erro ao carregar post:', error);
    return {
      props: {
        post: null,
        adjacentPosts: { previous: null, next: null },
      },
    };
  }
}
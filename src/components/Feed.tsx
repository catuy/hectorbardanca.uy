import { useTina, tinaField } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';

function RichContent({ content }: { content: any }) {
  if (!content) return null;
  // If it's a Tina AST object, use TinaMarkdown
  if (typeof content === 'object' && content.type === 'root') {
    return <TinaMarkdown content={content} />;
  }
  // If it's a plain string (from YAML fallback), render as paragraphs
  if (typeof content === 'string') {
    const paragraphs = content.split('\n\n').filter(Boolean);
    return <>{paragraphs.map((p, i) => <p key={i}>{p}</p>)}</>;
  }
  return null;
}

function VideoBlock({ block, index }: { block: any; index: number }) {
  const label = [block.title, block.description || block.credits].filter(Boolean).join(' / ');
  return (
    <article className="post post-video" data-category="videos">
      {block.embed && (
        <iframe
          className="post-video__embed"
          src={block.embed}
          allowFullScreen
          loading="lazy"
          data-tina-field={tinaField(block, 'embed')}
        />
      )}
      <span className="post-video__label" data-tina-field={tinaField(block, 'title')}>{label}</span>
    </article>
  );
}

function DiscoBlock({ block }: { block: any }) {
  return (
    <article className="post post-disco" data-category="musica">
      {block.cover && (
        <img
          className="post-disco__cover"
          src={block.cover}
          alt={block.title}
          loading="lazy"
          data-tina-field={tinaField(block, 'cover')}
        />
      )}
      <div className="post-disco__info">
        {block.showTitle !== false && <h2 className="post-disco__title" data-tina-field={tinaField(block, 'title')}>{block.title}</h2>}
        {block.artist && <span className="post-disco__artist" data-tina-field={tinaField(block, 'artist')}>{block.artist}</span>}
        {block.year && <span className="post-disco__year" data-tina-field={tinaField(block, 'year')}>{block.year}</span>}
        {block.tracks && block.tracks.length > 0 && (
          <ul className="post-disco__tracks" data-tina-field={tinaField(block, 'tracks')}>
            {block.tracks.map((track: any, i: number) => (
              <li key={i} className="post-disco__track" data-src={track.file}>
                <button className="post-disco__track-btn" aria-label={`Reproducir ${track.title}`}>&#9654;</button>
                <span className="post-disco__track-name">{track.title}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

function FotoBlock({ block }: { block: any }) {
  if (!block.images || block.images.length === 0) return null;
  const imgClass = block.fitScreen ? 'post-foto__image post-foto__image--fit' : 'post-foto__image';
  const creditsClass = block.fitScreen ? 'post-foto__credits post-foto__credits--center' : 'post-foto__credits';
  return (
    <article className={block.fitScreen ? 'post post--fit-center' : 'post'} data-category="fotos">
      {block.images.length === 1 ? (
        <img className={imgClass} src={block.images[0]} alt="" loading="lazy" data-tina-field={tinaField(block, 'images')} />
      ) : (
        <div className="post-foto__gallery" data-tina-field={tinaField(block, 'images')}>
          {block.images.map((src: string, i: number) => (
            <img key={i} className={imgClass} src={src} alt="" loading="lazy" />
          ))}
        </div>
      )}
      {!block.fullscreen && block.credits && (
        <p className={creditsClass} data-tina-field={tinaField(block, 'credits')}>{block.credits}</p>
      )}
    </article>
  );
}

function TextoBlock({ block }: { block: any }) {
  const imgClass = block.fitScreen ? 'post-foto__image post-foto__image--fit' : 'post-foto__image';
  const creditsClass = block.fitScreen ? 'post-foto__credits post-foto__credits--center' : 'post-foto__credits';
  return (
    <article className={block.fitScreen ? 'post post-inner post--fit-center' : 'post post-inner'} data-category="textos">
      {block.showTitle !== false && <h2 className="post-texto__title" data-tina-field={tinaField(block, 'title')}>{block.title}</h2>}
      {block.images && block.images.length > 0 && (
        <div className="post-foto__gallery" data-tina-field={tinaField(block, 'images')}>
          {block.images.map((src: string, i: number) => (
            <img key={i} className={imgClass} src={src} alt="" loading="lazy" />
          ))}
        </div>
      )}
      {block.content && (
        <div className={block.fitScreen ? 'post-texto__body post-foto__credits--center' : 'post-texto__body'} data-tina-field={tinaField(block, 'content')}>
          <RichContent content={block.content} />
        </div>
      )}
      {block.credits && <p className={creditsClass} data-tina-field={tinaField(block, 'credits')}>{block.credits}</p>}
    </article>
  );
}

function BioBlock({ block }: { block: any }) {
  return (
    <article className="post post-bio post-inner" data-category="bio">
      {block.showTitle !== false && <h2 className="post-bio__title" data-tina-field={tinaField(block, 'title')}>{block.title}</h2>}
      {block.content && (
        <div className="post-bio__body" data-tina-field={tinaField(block, 'content')}>
          <RichContent content={block.content} />
        </div>
      )}
      {block.images && block.images.length > 0 && (
        <img className="post-bio__photo" src={block.images[0]} alt="" loading="lazy" />
      )}
      {block.credits && <p className="post-bio__credits" data-tina-field={tinaField(block, 'credits')}>{block.credits}</p>}
    </article>
  );
}

interface FeedProps {
  query: string;
  variables: Record<string, any>;
  data: any;
}

export default function Feed(props: FeedProps) {
  const { data } = useTina(props);
  const blocks = data?.page?.blocks || [];

  return (
    <div className="feed">
      {blocks.map((block: any, i: number) => {
        const fs = block.fullscreen ? ' post-section--full' : '';
        const navSame = i === 0 ? ' post-section--nav-same' : '';
        const bg = block.bgColor || '#ffffff';
        const txt = block.textColor || '#000000';
        const styles = {
          backgroundColor: bg,
          color: txt,
          '--section-bg': bg,
          '--section-text': txt,
        } as React.CSSProperties;

        let content = null;
        const template = block.__typename?.replace('PageBlocksPage_BlocksBlocks', '') || block._template;

        switch (template) {
          case 'video':
          case 'PageBlocksVideo':
            content = <VideoBlock block={block} index={i} />;
            break;
          case 'disco':
          case 'PageBlocksDisco':
            content = <DiscoBlock block={block} />;
            break;
          case 'foto':
          case 'PageBlocksFoto':
            content = <FotoBlock block={block} />;
            break;
          case 'texto':
          case 'PageBlocksTexto':
            content = <TextoBlock block={block} />;
            break;
          case 'bio':
          case 'PageBlocksBio':
            content = <BioBlock block={block} />;
            break;
        }

        if (!content) return null;

        return (
          <section key={i} className={`post-section${fs}${navSame}`} style={styles} data-tina-field={tinaField(block)}>
            {content}
          </section>
        );
      })}
    </div>
  );
}

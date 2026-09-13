import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function PublicTextSection({ sectionKey, title, id, variant }) {
  const [body, setBody] = useState('');

  useEffect(() => {
    api
      .get(`/content/${sectionKey}`)
      .then((res) => setBody(res.data.body || ''))
      .catch(() => setBody(''));
  }, [sectionKey]);

  if (!body) return null;

  const sectionClass = variant === 'blue' ? 'public-section public-section-blue' : 'public-section';

  const content = (
    <>
      <h2 className="public-section-title">{title}</h2>
      <p
        style={{
          maxWidth: 720,
          margin: '0 auto',
          lineHeight: 1.8,
          textAlign: 'center',
          color: variant === 'blue' ? '#ffffff' : 'var(--color-text)',
        }}
      >
        {body}
      </p>
    </>
  );

  if (variant === 'blue') {
    return (
      <section className={sectionClass} id={id}>
        <div className="public-section-inner">{content}</div>
      </section>
    );
  }

  return (
    <section className={sectionClass} id={id}>
      {content}
    </section>
  );
}
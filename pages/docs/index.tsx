import React from 'react';
import { useTranslation } from 'react-i18next';
import { Page } from '../../components/Docs/Page';
import { Description, OtherMeta, Title } from '../../components/Meta';
import { DocsLayout } from '../../components/Page/DocsLayout';
import { getAllPosts } from '../../lib/api';
import { PageFrontMatter } from '../../models/PageFrontMatter';
import { pageProcessing } from '../../utils/pageProcessing';
import markdownToHtml from '../../utils/markdownToHtml';
import generateOgImage from '../../utils/generateOgImage';

export default function Home({ pages, page, ogImage }: { pages: PageFrontMatter[]; page: PageFrontMatter; ogImage?: string }) {
  const { t: strings } = useTranslation();

  return (
    <>
      <Title value={strings(`documentation_title`)} />
      <Description value={strings(`documentation_description`)} />
      <OtherMeta image={ogImage || `/assets/frontmatter-social.png`} />

      <DocsLayout navItems={pages} >
        <Page items={pages} page={page}>
          <div
            className={`markdown ${page?.slug}`}
            dangerouslySetInnerHTML={{ __html: page.content || "" }}>
          </div>
        </Page>
      </DocsLayout>
    </>
  )
}

export const getStaticProps = async () => {
  let pages = getAllPosts('docs', [
    'title',
    'slug',
    'description',
    'date',
    'lastmod',
    'weight',
    'content',
    'fileName'
  ]);

  const welcome = Object.assign({}, pages?.find(p => p.slug === "index"));
  welcome.content = await markdownToHtml(welcome.content || '');

  const ogImage = await generateOgImage(welcome.title, welcome.description);

  pages = pages.map(pageProcessing);

  return {
    props: { pages, page: welcome, ogImage },
  }
}
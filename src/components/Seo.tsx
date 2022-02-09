import Head from 'next/head';

interface Props
{
  title: string,
  description?: string,
}
const Seo = ({ title, description }: Props) =>
{
  return (
    <Head>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}

export default Seo;

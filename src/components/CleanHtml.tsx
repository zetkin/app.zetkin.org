import dompurify from 'dompurify';

const CleanHtml = ({ dirtyHtml }: { dirtyHtml: string }): JSX.Element => {
  const cleanHtml = dompurify.sanitize(dirtyHtml);
  return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
};

export default CleanHtml;

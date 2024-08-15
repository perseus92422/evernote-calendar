import dynamic from 'next/dynamic';

const Editor = dynamic(
    () => import('react-draft-wysiwyg')
        .then(mod => mod.Editor), { ssr: false });

export default Editor;


import Layout from '../components/Layout';
import { getAllPostData } from '../lib/fetch';
import Post from '../components/Post';
import { GetStaticProps } from 'next';
import { POST } from '../Types/Types';

interface STATICPROPS {
    posts: POST[]
}


const BlogPage: React.FC<STATICPROPS> = ({ posts }) => {
  return (
    <Layout title='Blog'>
        <p className="text-4xl mb-10">Blog page</p>
        <ul>{posts && posts.map(post => <Post key={post.id} {...post} />)}</ul>
    </Layout>
  )
}
export default BlogPage;

export const getStaticProps: GetStaticProps = async () => {
    const posts = await getAllPostData();
    return {
        props: { posts }
    };
}
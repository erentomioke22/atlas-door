import CreatePost from "@components/posts/create-post";

export const metadata = {
  metadataBase: new URL("https://www.atlasdoor.ir/privacy-policy"),
  title :'create post',
}
const Page = ({ params }) => {

  return (
    <div>
        <CreatePost params={params}/>
    </div>
  );
};

export default Page;

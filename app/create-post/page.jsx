import CreatePost from "@components/posts/create-post";

export const metadata = {
  metadataBase: new URL("https://www.atlasdoor.ir/privacy-policy"),
  title :'create post',
}
const Page = () => {

  return (
    <div>
        <CreatePost/>
    </div>
  );
};

export default Page;

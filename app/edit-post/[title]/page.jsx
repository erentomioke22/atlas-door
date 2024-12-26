import EditPost from "@components/posts/edit-post";
export const metadata = {
  metadataBase: new URL("https://www.atlasdoor.ir/privacy-policy"),
  title :'edit post',
}
const Page = ({ params }) => {

  return (
    <div>
        <EditPost params={params}/>
    </div>
  );
};

export default Page;

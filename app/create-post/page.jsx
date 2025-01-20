import CreatePost from "./create-post";

export const metadata = {
  metadataBase: new URL("https://www.atlasdoors.ir/create-post"),
  title: "create post",
};
const Page = () => {
  return (
    <div>
      <CreatePost />
    </div>
  );
};

export default Page;

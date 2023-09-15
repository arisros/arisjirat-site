import fs from "fs";
import Markdown from "markdown-to-jsx";
import matter from "gray-matter";
import getMetadataFiles from "../../../utils/getMetadataFiles";
import Link from "next/link";
import RecursiveMenuItem from "../../../components/RecursiveMenu";
import { BsArrowRightShort } from "react-icons/bs";

const getStudyContent = (path: string) => {
  const studies = getMetadataFiles("studies/");
  const file = `${path}.md`;
  const item = studies[path];
  if (studies[path]?.type === "file") {
    const content = fs.readFileSync(file, "utf8");
    const matterResult = matter(content);
    return {
      title: matterResult.data.title,
      date: matterResult.data.date,
      content: matterResult.content,
      item: item,
    };
  }

  return {
    title: item?.metadata?.title,
    date: item?.metadata?.date,
    content: "",
    item: item,
  };
};

export const generateStaticParams = async () => {
  const studies = getMetadataFiles("studies/");

  const slugs = Object.keys(studies).map((post) => ({
    slug: studies[post].path
      .replace(/.md$/, "")
      .replace(/^studies?\//, "")
      .split("/"),
  }));

  return slugs;
};

const BreadCrumb = ({ pathString }: { pathString: string }) => {
  const pathArray = pathString.split("/");

  const getPath = (currentPath: string) => {
    const prePath = pathString.split(currentPath)[0];

    if (!prePath) {
      return `/${currentPath}`;
    }
    return `/${prePath}/${currentPath}`;
  };

  return (
    <ul className="flex flex-wrap gap-2">
      {pathArray.map((path, index) => (
        <li className="whitespace-nowrap flex" key={path}>
          {index < pathArray.length - 1 ? (
            <Link href={getPath(path)}>
              <span className="text-green-800">{path?.replace(/-/g, " ")}</span>
            </Link>
          ) : (
            <span>{path?.replace(/-/g, " ")}</span>
          )}
          {index < pathArray.length - 1 && <BsArrowRightShort />}
        </li>
      ))}
    </ul>
  );
};

const StudyPage = (props: any) => {
  const slug = props.params.slug;
  const post = getStudyContent(`studies/${slug.join("/")}`);

  if (!post.content) {
    return (
      <>
        <BreadCrumb pathString={post.item?.path ?? ""} />
        <h1>{post.item?.name}</h1>
        <ul>
          <RecursiveMenuItem item={post.item} />
        </ul>
      </>
    );
  }

  return (
    <div>
      <BreadCrumb pathString={post.item.path} />
      <div className="my-12 text-center">
        <h1 className="text-2xl text-slate-600 ">{post.title}</h1>
        <p className="text-slate-400 mt-2">{post.date}</p>
      </div>

      <article className="prose">
        <Markdown options={{}}>{post.content}</Markdown>
      </article>
    </div>
  );
};

export default StudyPage;

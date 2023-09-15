import RecursiveMenuItem from "../../components/RecursiveMenu";
import { buildFolderStructure } from "../../utils/getMetadataFiles";

const StudiesPage = () => {
  const studies = buildFolderStructure("studies/");

  return (
    <div>
      <div className="my-12 text-center">
        <h1 className="text-2xl text-slate-600 ">Studies</h1>
        <p>dihalaman ini adalah tulisan saya selama saya kuliah</p>
      </div>
      <ul>
        <RecursiveMenuItem item={studies} />
      </ul>
      <article className="prose"></article>
    </div>
  );
};

export default StudiesPage;
